import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './home.component';
import { PeopleComponent } from '../people/people.component';
import { InfoComponent } from '../info/info.component';
import { SpeciesComponent } from '../species/species.component';

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
