import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatExpansionPanelDescription } from '@angular/material';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  offset = new BehaviorSubject(null);

  films = [];
  film = {
    "title": "",
    "episode_id": "",
    "opening_crawl": "",
    "director": "",
    "producer": "",
    "release_date": "",
    "species": [],
    "starships": [],
    "vehicles": [],
    "characters": [],
    "planets": [],
    "created": "",
    "edited": "",
    "url": ""
  };
  nextPage = 'https://swapi.co/api/films';
  loading = false;
  detailsLoading = false;

  search: FormControl;
  searchForm: FormGroup;
  constructor(private route: ActivatedRoute, private swapiService: SwapiService, private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id != null) {
        // Load the right article
        console.log('Detected Film ID: ' + id);
        this.getDetails('https://swapi.co/api/films/' + id + '/');
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
          return this.swapiService.searchFilm(query.trim());
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
        this.films = response.results;
        console.log(this.films);
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.loading = false;
      } else {
        this.films = [];
        this.nextPage = 'https://swapi.co/api/films';
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
    this.swapiService.getFilm(url)
    .subscribe((response) => {
      console.log(response);
      this.film = response;
      this.detailsLoading = false;
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });
  }

  getBatch() {
    console.log('getting page: ' + this.nextPage);
    this.loading = true;
    this.swapiService.getFilms(this.nextPage)
      .subscribe((response) => {
        console.log(response);
        this.nextPage = response.next;
        if (this.nextPage === '' || this.nextPage === null || this.nextPage === undefined) {
          this.theEnd = true;
        } else {
          this.theEnd = false;
        }
        this.films = [...this.films, ...response.results];
        console.log(this.films);
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

  personInfo(url) {
    console.log('Lookup Person Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/people', url.split('/')[5]]);
    }
  }

  planetInfo(url) {
    console.log('Lookup Planet Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/planets', url.split('/')[5]]);
    }
  }

  specieInfo(url) {
    console.log('Lookup Specie Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/species', url.split('/')[5]]);
    }
  }
  
  starshipInfo(url) {
    console.log('Lookup Starship Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/starships', url.split('/')[5]]);
    }
  }

  vehicleInfo(url) {
    console.log('Lookup Vehicle Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/vehicles', url.split('/')[5]]);
    }
  }

  movieView(episode, title, openingText) {
    if (openingText) {
      // format opening text
      const temp = openingText.split('\r\n\r\n');
      let formatted = '';
      for (let i = 0; i < temp.length; i++) {
        formatted += '<p>' + temp[i] + '</p>';
      }
      const dialogRef = this.dialog.open(OpeningViewComponent, {
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        data: {
          episode: episode,
          title: title,
          text: formatted
        }
      });
    }
  }

  ngOnDestroy() {
    this.cdRef.detach();
    this.offset.unsubscribe();
  }
}

@Component({
  selector: 'app-opening-view',
  templateUrl: 'openingView.dialog.html',
  styleUrls: ['./films.component.css']
})
export class OpeningViewComponent {

  constructor(
    public dialogRef: MatDialogRef<OpeningViewComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any) {}
}
