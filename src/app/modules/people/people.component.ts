import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { People } from './people';
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PeopleComponent implements OnInit {
  ds = new MyDataSource(this.swapiService);

  constructor(private route: ActivatedRoute, private swapiService: SwapiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id != null) {
          // Load the right article
          console.log(id);
      }
    });
  }


  // this._apiService.get().subscribe(response => {
  //   console.log(response);
  //   }
  // },
  // error => {
  //   console.error(error);
  //   this.openSnackBar('error!');
  // });
}

export class MyDataSource extends DataSource<any> {
  private people: People[];
  private nextPage = 'https://swapi.co/api/people';
  private dataStream = new BehaviorSubject<any[]>([]);

  constructor(private swapiService: SwapiService) {
    super();
  }

  connect() {
    this.swapiService.getPeople(this.nextPage)
      .subscribe((response) => {
        console.log(response);
        this.nextPage = response.next;
        this.people = response.results;
        this.dataStream.next(this.people);
      });
    return this.dataStream;
  }

  disconnect(): void {
  }
}

