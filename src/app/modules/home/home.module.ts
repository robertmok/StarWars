import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PeopleComponent } from '../people/people.component';
import { routing } from './home.routing';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../../core/header/header.module';
import { InfoComponent } from '../info/info.component';
import { MaterialModule } from '../../shared/material-module';
@NgModule({
  imports: [
    CommonModule,
    routing,
    HeaderModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    HomeComponent,
    PeopleComponent,
    InfoComponent
  ]
})
export class HomeModule { }
