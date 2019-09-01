import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PeopleComponent } from '../people/people.component';
import { SpeciesComponent } from '../species/species.component';
import { PlanetsComponent } from '../planets/planets.component';
import { StarshipsComponent } from '../starships/starships.component';
import { VehiclesComponent } from '../vehicles/vehicles.component';
import { FilmsComponent, OpeningViewComponent } from '../films/films.component';
import { routing } from './home.routing';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../../core/header/header.module';
import { InfoComponent } from '../info/info.component';
import { MaterialModule } from '../../shared/material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    routing,
    HeaderModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [OpeningViewComponent],
  declarations: [
    HomeComponent,
    PeopleComponent,
    SpeciesComponent,
    PlanetsComponent,
    StarshipsComponent,
    VehiclesComponent,
    FilmsComponent,
    OpeningViewComponent,
    InfoComponent
  ]
})
export class HomeModule { }
