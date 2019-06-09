import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  offset = new BehaviorSubject(null);

  planets = [];
  planet = {
    "name": "",
    "diameter": "",
    "rotation_period": "",
    "orbital_period": "",
    "gravity": "",
    "population": "",
    "climate": "",
    "terrain": "",
    "surface_water": "",
    "residents": [],
    "films": [],
    "created": "",
    "edited": "",
    "url": ""
  };
  nextPage = 'https://swapi.co/api/planets';
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
        console.log('Detected Planet ID: ' + id);
        this.getDetails('https://swapi.co/api/planets/' + id + '/');
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
          return this.swapiService.searchPlanet(query.trim());
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
        this.planets = response.results;
        console.log(this.planets);
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.loading = false;
      } else {
        this.planets = [];
        this.nextPage = 'https://swapi.co/api/planets';
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
    this.swapiService.getPlanet(url)
    .subscribe((response) => {
      console.log(response);
      this.planet = response;
      this.detailsLoading = false;
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });
  }

  getBatch() {
    console.log('getting page: ' + this.nextPage);
    this.loading = true;
    this.swapiService.getPlanets(this.nextPage)
      .subscribe((response) => {
        console.log(response);
        this.nextPage = response.next;
        if (this.nextPage === '' || this.nextPage === null || this.nextPage === undefined) {
          this.theEnd = true;
        } else {
          this.theEnd = false;
        }
        this.planets = [...this.planets, ...response.results];
        console.log(this.planets);
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

  filmInfo(url) {
    console.log('Lookup Film Info: ' + url);
    if (url.split('/').length > 5) {
      this.router.navigate(['/home/films', url.split('/')[5]]);
    }
  }


  ngOnDestroy() {
    this.cdRef.detach();
    this.offset.unsubscribe();
  }
}
