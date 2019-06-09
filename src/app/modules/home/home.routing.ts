import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';
import { PeopleComponent } from '../people/people.component';
import { InfoComponent } from '../info/info.component';
import { SpeciesComponent } from '../species/species.component';
import { PlanetsComponent } from '../planets/planets.component';
import { StarshipsComponent } from '../starships/starships.component';
import { VehiclesComponent } from '../vehicles/vehicles.component';
import { FilmsComponent } from '../films/films.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'people',
        component: PeopleComponent
      },
      {
        path: 'people/:id',
        component: PeopleComponent
      },
      {
        path: 'species',
        component: SpeciesComponent
      },
      {
        path: 'species/:id',
        component: SpeciesComponent
      },
      {
        path: 'planets',
        component: PlanetsComponent
      },
      {
        path: 'planets/:id',
        component: PlanetsComponent
      },
      {
        path: 'starships',
        component: StarshipsComponent
      },
      {
        path: 'starships/:id',
        component: StarshipsComponent
      },
      {
        path: 'vehicles',
        component: VehiclesComponent
      },
      {
        path: 'vehicles/:id',
        component: VehiclesComponent
      },
      {
        path: 'films',
        component: FilmsComponent
      },
      {
        path: 'films/:id',
        component: FilmsComponent
      },
      {
        path: '',
        component: InfoComponent
      }
    ]
  }
  // { path: '', redirectTo: 'info', pathMatch: 'full' },
  // { path: 'info', component: HomeComponent,
  //   children: [
  //     { path: '', component: InfoComponent, pathMatch: 'full' },
  //     { path: 'people', component: PeopleComponent }
  //   ]
  // }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
