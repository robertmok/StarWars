import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, retry, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(private httpC: HttpClient) { }

  getPeople(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        // retry(3) // retry a failed request up to 3 times
        catchError(this.handleError('getPeople', [])
      )
    );
  }

  getPerson(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((character: any) => {
        return this.httpC.get(character.homeworld).pipe(
          map((data: any) => {
            character.homeworld = data;
            return character;
          })
        );
      }),
      mergeMap((character: any) => {
        if (character.films.length > 0) {
          return forkJoin(
            character.films.map((film: any) => {
              return this.httpC.get(film).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              character.films = data;
              return character;
            })
          );
        } else {
          // character.films = of([]);
          // console.log('1');
          return of(character);
        }
      }),
      mergeMap((character: any) => {
        if (character.species.length > 0) {
          return forkJoin(
            character.species.map((specie: any) => {
              return this.httpC.get(specie).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              character.species = data;
              return character;
            })
          );
        } else {
          // character.species = [];
          // console.log('2');
          return of(character);
        }
      }),
      mergeMap((character: any) => {
        if (character.starships.length > 0) {
          return forkJoin(
            character.starships.map((starship: any) => {
              return this.httpC.get(starship).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              character.starships = data;
              return character;
            })
          );
        } else {
          // character.starships = [];
          // console.log('3');
          // console.log(character);
          return of(character);
        }
      }),
      mergeMap((character: any) => {
        if (character.vehicles.length > 0) {
          return forkJoin(
            character.vehicles.map((vehicle: any) => {
              return this.httpC.get(vehicle).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              character.vehicles = data;
              return character;
            })
          );
        } else {
          // character.vehicles = [];
          // console.log('4');
          return of(character);
        }
      })
      // retry(3) // retry a failed request up to 3 times
      // catchError(this.handleError('getPerson', []))
    );
  }

  searchPerson(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/people/?search=' + query)
      .pipe(
        // retry(3) // retry a failed request up to 3 times
        catchError(this.handleError('searchPerson', [])
      )
    );
  }

  // submit(object: string): Observable<string> {
  //   return this.httpC.post<string>('',
  //   object)
  //       .pipe(
  //           retry(3) // retry a failed request up to 3 times
  //   );
  // }

}
