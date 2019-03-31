import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home.component';
import { routing } from './home.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
