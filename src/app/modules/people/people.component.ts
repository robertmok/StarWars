import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { People } from './people';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PeopleComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  theEnd = false;
  offset = new BehaviorSubject(null);

  people = [];
  nextPage = 'https://swapi.co/api/people';
  loading = false;

  // ds = new MyDataSource(this.swapiService);

  constructor(private route: ActivatedRoute, private swapiService: SwapiService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id != null) {
          // Load the right article
          console.log(id);
      }
    });

    // this.swapiService.getPeople(this.nextPage)
    //   .subscribe((response) => {
    //     console.log(response);
    //     this.nextPage = response.next;
    //     this.people = [...this.people, ...response.results];
    //     console.log(this.people);
    // });

    this.offset.subscribe(value => {
      console.log('Subscription got ', value);
      this.getBatch();
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
        }
        this.people = [...this.people, ...response.results];
        console.log(this.people);
        this.cdRef.detectChanges();
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
    if (end === total && this.loading === false) {
      this.offset.next(e);
    }
  }

  trackByIdx(i) {
    return i;
  }
}

// export class MyDataSource extends DataSource<any> {
//   private people: People[] = [{
//     "name": "Luke Skywalker",
//     "height": "172",
//     "mass": "77",
//     "hair_color": "blond",
//     "skin_color": "fair",
//     "eye_color": "blue",
//     "birth_year": "19BBY",
//     "gender": "male",
//     "homeworld": "https://swapi.co/api/planets/1/",
//     "films": [
//       "https://swapi.co/api/films/2/",
//       "https://swapi.co/api/films/6/",
//       "https://swapi.co/api/films/3/",
//       "https://swapi.co/api/films/1/",
//       "https://swapi.co/api/films/7/"
//     ],
//     "species": [
//       "https://swapi.co/api/species/1/"
//     ],
//     "vehicles": [
//       "https://swapi.co/api/vehicles/14/",
//       "https://swapi.co/api/vehicles/30/"
//     ],
//     "starships": [
//       "https://swapi.co/api/starships/12/",
//       "https://swapi.co/api/starships/22/"
//     ],
//     "created": "2014-12-09T13:50:51.644000Z",
//     "edited": "2014-12-20T21:17:56.891000Z",
//     "url": "https://swapi.co/api/people/1/"
//   }];
//   private nextPage = 'https://swapi.co/api/people';
//   private loading = false;
//   private dataStream = new BehaviorSubject<any>(this.people);
//   private subscription = new Subscription();

//   constructor(private swapiService: SwapiService) {
//     super();
//   }

//   connect(collectionViewer: CollectionViewer): Observable<any> {
//     this.subscription.add(collectionViewer.viewChange.subscribe(range => {
//       console.log(range.start);
//       console.log(range.end);
//       if (this.nextPage !== 'null' && this.nextPage !== null && this.nextPage !== undefined) {
//         // if (this.loading !== true) {
//           console.log('getting next page ...');
//           this.loading = true;
//           console.log(this.nextPage);
//           this.swapiService.getPeople(this.nextPage)
//             .subscribe((response) => {
//               console.log(response);
//               this.nextPage = response.next;
//               this.people = [...this.people, ...response.results];
//               console.log(this.people);
//               this.dataStream.next(this.people);
//               this.loading = false;
//           });
//         // } else {
//         //   console.log('loading');
//         //   this.dataStream.next(this.people);
//         // }
//       } else {
//         console.log('end of data');
//       }
//     }));

//     // this.swapiService.getPeople(this.nextPage)
//     //   .subscribe((response) => {
//     //     console.log(response);
//     //     this.nextPage = response.next;
//     //     this.people = response.results;
//     //     this.dataStream.next(this.people);
//     //   });
//     return this.dataStream;
//   }

//   disconnect(): void {
//     this.subscription.unsubscribe();
//   }
// }

