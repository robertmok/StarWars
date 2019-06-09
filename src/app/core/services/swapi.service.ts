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
        if (character.homeworld !== null) {
          return this.httpC.get(character.homeworld).pipe(
            map((data: any) => {
              character.homeworld = data;
              return character;
            })
          );
        } else {
          character.homeworld = {
            "name": "none",
            "url": ""
          };
          return of(character);
        }
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
          return of(character);
        }
      })
    );
  }

  searchPerson(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/people/?search=' + query)
      .pipe(
        catchError(this.handleError('searchPerson', [])
      )
    );
  }

  getSpecies(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        catchError(this.handleError('getSpecies', [])
      )
    );
  }

  getSpecie(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((specie: any) => {
        if (specie.homeworld !== null) {
          return this.httpC.get(specie.homeworld).pipe(
            map((data: any) => {
              specie.homeworld = data;
              return specie;
            })
          );
        } else {
          specie.homeworld = {
            "name": "none",
            "url": ""
          };
          return of(specie);
        }
      }),
      mergeMap((specie: any) => {
        if (specie.people.length > 0) {
          return forkJoin(
            specie.people.map((person: any) => {
              return this.httpC.get(person).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              specie.people = data;
              return specie;
            })
          );
        } else {
          return of(specie);
        }
      }),
      mergeMap((specie: any) => {
        if (specie.films.length > 0) {
          return forkJoin(
            specie.films.map((film: any) => {
              return this.httpC.get(film).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              specie.films = data;
              return specie;
            })
          );
        } else {
          return of(specie);
        }
      })
    );
  }

  searchSpecie(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/species/?search=' + query)
      .pipe(
        catchError(this.handleError('searchSpecie', [])
      )
    );
  }

  getPlanets(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        catchError(this.handleError('getPlanets', [])
      )
    );
  }

  getPlanet(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((planet: any) => {
        if (planet.residents.length > 0) {
          return forkJoin(
            planet.residents.map((person: any) => {
              return this.httpC.get(person).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              planet.residents = data;
              return planet;
            })
          );
        } else {
          return of(planet);
        }
      }),
      mergeMap((planet: any) => {
        if (planet.films.length > 0) {
          return forkJoin(
            planet.films.map((film: any) => {
              return this.httpC.get(film).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              planet.films = data;
              return planet;
            })
          );
        } else {
          return of(planet);
        }
      })
    );
  }

  searchPlanet(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/planets/?search=' + query)
      .pipe(
        catchError(this.handleError('searchPlanet', [])
      )
    );
  }

  getStarships(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        catchError(this.handleError('getStarships', [])
      )
    );
  }

  getStarship(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((starship: any) => {
        if (starship.pilots.length > 0) {
          return forkJoin(
            starship.pilots.map((person: any) => {
              return this.httpC.get(person).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              starship.pilots = data;
              return starship;
            })
          );
        } else {
          return of(starship);
        }
      }),
      mergeMap((starship: any) => {
        if (starship.films.length > 0) {
          return forkJoin(
            starship.films.map((film: any) => {
              return this.httpC.get(film).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              starship.films = data;
              return starship;
            })
          );
        } else {
          return of(starship);
        }
      })
    );
  }

  searchStarship(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/starships/?search=' + query)
      .pipe(
        catchError(this.handleError('searchStarship', [])
      )
    );
  }

  getVehicles(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        catchError(this.handleError('getVehicles', [])
      )
    );
  }

  getVehicle(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((vehicle: any) => {
        if (vehicle.pilots.length > 0) {
          return forkJoin(
            vehicle.pilots.map((person: any) => {
              return this.httpC.get(person).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              vehicle.pilots = data;
              return vehicle;
            })
          );
        } else {
          return of(vehicle);
        }
      }),
      mergeMap((vehicle: any) => {
        if (vehicle.films.length > 0) {
          return forkJoin(
            vehicle.films.map((film: any) => {
              return this.httpC.get(film).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              vehicle.films = data;
              return vehicle;
            })
          );
        } else {
          return of(vehicle);
        }
      })
    );
  }

  searchVehicle(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/vehicles/?search=' + query)
      .pipe(
        catchError(this.handleError('searchVehicle', [])
      )
    );
  }

  getFilms(url: string): Observable<any> {
    return this.httpC.get<any>(url)
      .pipe(
        catchError(this.handleError('getFilms', [])
      )
    );
  }

  getFilm(url: string): Observable<any> {
    return this.httpC.get<any>(url).pipe(
      mergeMap((film: any) => {
        if (film.characters.length > 0) {
          return forkJoin(
            film.characters.map((person: any) => {
              return this.httpC.get(person).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              film.characters = data;
              return film;
            })
          );
        } else {
          return of(film);
        }
      }),
      mergeMap((film: any) => {
        if (film.planets.length > 0) {
          return forkJoin(
            film.planets.map((planet: any) => {
              return this.httpC.get(planet).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              film.planets = data;
              return film;
            })
          );
        } else {
          return of(film);
        }
      }),
      mergeMap((film: any) => {
        if (film.species.length > 0) {
          return forkJoin(
            film.species.map((specie: any) => {
              return this.httpC.get(specie).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              film.species = data;
              return film;
            })
          );
        } else {
          return of(film);
        }
      }),
      mergeMap((film: any) => {
        if (film.starships.length > 0) {
          return forkJoin(
            film.starships.map((starship: any) => {
              return this.httpC.get(starship).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              film.starships = data;
              return film;
            })
          );
        } else {
          return of(film);
        }
      }),
      mergeMap((film: any) => {
        if (film.vehicles.length > 0) {
          return forkJoin(
            film.vehicles.map((vehicle: any) => {
              return this.httpC.get(vehicle).pipe(
                map(res => res)
              );
            })
          ).pipe(
            map((data: any[]) => {
              film.vehicles = data;
              return film;
            })
          );
        } else {
          return of(film);
        }
      })
    );
  }

  searchFilm(query: string): Observable<any> {
    return this.httpC.get<any>('https://swapi.co/api/films/?search=' + query)
      .pipe(
        catchError(this.handleError('searchFilm', [])
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
