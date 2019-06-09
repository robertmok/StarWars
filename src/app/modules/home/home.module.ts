import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PeopleComponent } from '../people/people.component';
import { SpeciesComponent } from '../species/species.component';
import { PlanetsComponent } from '../planets/planets.component';
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
  declarations: [
    HomeComponent,
    PeopleComponent,
    SpeciesComponent,
    PlanetsComponent,
    InfoComponent
  ]
})
export class HomeModule { }
