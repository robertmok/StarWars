import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { People } from './people';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var pdfMake: any;

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PeopleComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  offset = new BehaviorSubject(null);

  people = [];
  person = {
    "name": "",
    "height": "",
    "mass": "",
    "hair_color": "",
    "skin_color": "",
    "eye_color": "",
    "birth_year": "",
    "gender": "",
    "homeworld": {
      "name": "",
      "url": ""
    },
    "films": [],
    "species": [],
    "vehicles": [],
    "starships": [],
    "created": "",
    "edited": "",
    "url": ""
  };
  nextPage = 'https://swapi.co/api/people';
  loading = false;
  detailsLoading = false;

  search: FormControl;
  searchForm: FormGroup;

  constructor(private route: ActivatedRoute, private swapiService: SwapiService, private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id != null) {
        // Load the right article
        console.log('Detected Person ID: ' + id);
        this.getDetails('https://swapi.co/api/people/' + id + '/');
      } else {
        console.log('No route param');
      }
    });

    this.offset.subscribe(value => {
      console.log('Subscription got ', value);
      this.getBatch();
    });

    this.search = new FormControl();
    this.searchForm = this.formBuilder.group(
      { search: this.search}
    );

    this.search.valueChanges.pipe(
      debounceTime(500),
      switchMap(query => {
        console.log(query.trim());
        if (query !== '') {
          return this.swapiService.searchPerson(query.trim());
        } else {
          return of('default');
        }
      })
    ).subscribe((response) => {
      console.log(response);
      if (response !== 'default') {
        this.nextPage = response.next;
        if (this.nextPage === '' || this.nextPage === null || this.nextPage === undefined) {
          this.theEnd = true;
        } else {
          this.theEnd = false;
        }
        this.people = response.results;
        console.log(this.people);
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.loading = false;
      } else {
        this.people = [];
        this.nextPage = 'https://swapi.co/api/people';
        this.theEnd = false;
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.getBatch();
      }
    });
  }

  getDetails(url) {
    console.log('Get details of: ' + url);
    this.detailsLoading = true;
    this.swapiService.getPerson(url)
    .subscribe((response) => {
      console.log(response);
      this.person = response;
      this.detailsLoading = false;
      // console.log(this.person);
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });
  }

  getBatch() {
    console.log('getting page: ' + this.nextPage);
    this.loading = true;
    this.swapiService.getPeople(this.nextPage)
      .subscribe((response) => {
        console.log(response);
        this.nextPage = response.next;
        if (this.nextPage === '' || this.nextPage === null || this.nextPage === undefined) {
          this.theEnd = true;
        } else {
          this.theEnd = false;
        }
        this.people = [...this.people, ...response.results];
        console.log(this.people);
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.loading = false;
    });
  }

  nextBatch(e) {
    // console.log('get next page ...');
    if (this.theEnd) {
      console.log('end of data');
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end >= total && this.loading === false) {
      this.offset.next(e);
    }
  }

  trackByIdx(i) {
    return i;
  }

  specieInfo(url) {
    console.log('Lookup Specie Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/species', url.split('/')[5]]);
    }
  }

  homeworldInfo(url) {
    console.log('Lookup Home World Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/planets', url.split('/')[5]]);
    }
  }

  download() {
    console.log('download');

    let personSpecies = [];
    for (let obj of this.person.species) {
      personSpecies.push(obj.name);
    }
    let personStarships = [];
    for (let obj of this.person.starships) {
      personStarships.push(obj.name);
    }
    let personVehicles = [];
    for (let obj of this.person.vehicles) {
      personVehicles.push(obj.name);
    }
    let personFilms = [];
    for (let obj of this.person.films) {
      personFilms.push(obj.title);
    }

    const docDefinition = {
      footer: function(currentPage, pageCount) { return [
          { columns: [
              { text: 'https://robertmok.github.io/StarWars/', margin: [30, 0, 0, 0]},
              { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', margin: [0, 0, 30, 0] }
            ]
          }
        ]
      },
      content: [
        {text: this.person.name + ' Details', style: 'header'},
        {
          style: 'tableExample',
          table: {
            widths: [200, '*'],
            body: [
              [
                {
                  text: [
                    {text: 'Birth Year:\n', style: 'tableHeader'},
                    'BBY = Before the Battle of Yavin\n',
                    'ABY = After the Battle of Yavin'
                  ]
                },
                this.person.birth_year
              ],
              [
                {text: 'Species Belonged To:', style: 'tableHeader'},
                {
                  ul: personSpecies
                }
              ],
              [
                {text: 'Gender:', style: 'tableHeader'},
                this.person.gender
              ],
              [
                {text: 'Home World:', style: 'tableHeader'},
                this.person.homeworld.name
              ],
              [
                {text: 'Height:', style: 'tableHeader'},
                this.person.height + ' cm'
              ],
              [
                {text: 'Weight:', style: 'tableHeader'},
                this.person.mass + ' kg'
              ],
              [
                {text: 'Eye Color:', style: 'tableHeader'},
                this.person.eye_color
              ],
              [
                {text: 'Hair Color:', style: 'tableHeader'},
                this.person.hair_color
              ],
              [
                {text: 'Starships Piloted:', style: 'tableHeader'},
                {
                  ul: personStarships
                }
              ],
              [
                {text: 'Vehicles Driven:', style: 'tableHeader'},
                {
                  ul: personVehicles
                }
              ],
              [
                {text: 'Films Starred In:', style: 'tableHeader'},
                {
                  ul: personFilms
                }
              ]
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true
        }
      }
    };
    pdfMake.createPdf(docDefinition).open();
    // pdfMake.createPdf(docDefinition).download();
  }


  ngOnDestroy() {
    this.cdRef.detach();
    this.offset.unsubscribe();
  }
}
