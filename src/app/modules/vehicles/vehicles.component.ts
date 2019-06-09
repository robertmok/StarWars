import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  offset = new BehaviorSubject(null);

  vehicles = [];
  vehicle = {
    "name": "",
    "model": "",
    "vehicle_class": "",
    "manufacturer": "",
    "cost_in_credits": "",
    "length": "",
    "crew": "",
    "passengers": "",
    "max_atmosphering_speed": "",
    "cargo_capacity": "",
    "consumables": "",
    "films": [],
    "pilots": [],
    "created": "",
    "edited": "",
    "url": ""
  };
  nextPage = 'https://swapi.co/api/vehicles';
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
        console.log('Detected Vehicle ID: ' + id);
        this.getDetails('https://swapi.co/api/vehicles/' + id + '/');
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
          return this.swapiService.searchVehicle(query.trim());
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
        this.vehicles = response.results;
        console.log(this.vehicles);
        if (!this.cdRef['destroyed']) {
          this.cdRef.detectChanges();
        }
        this.loading = false;
      } else {
        this.vehicles = [];
        this.nextPage = 'https://swapi.co/api/vehicles';
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
    this.swapiService.getVehicle(url)
    .subscribe((response) => {
      console.log(response);
      this.vehicle = response;
      this.detailsLoading = false;
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });
  }

  getBatch() {
    console.log('getting page: ' + this.nextPage);
    this.loading = true;
    this.swapiService.getVehicles(this.nextPage)
      .subscribe((response) => {
        console.log(response);
        this.nextPage = response.next;
        if (this.nextPage === '' || this.nextPage === null || this.nextPage === undefined) {
          this.theEnd = true;
        } else {
          this.theEnd = false;
        }
        this.vehicles = [...this.vehicles, ...response.results];
        console.log(this.vehicles);
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
