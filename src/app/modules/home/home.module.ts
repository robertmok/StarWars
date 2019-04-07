import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { routing } from './home.routing';
import { HeaderModule } from '../../core/header/header.module';
@NgModule({
  imports: [
    CommonModule,
    routing,
    HeaderModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
