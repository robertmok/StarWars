import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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
            catchError(this.handleError('getPeople', []))
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
