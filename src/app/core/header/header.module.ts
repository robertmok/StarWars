import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from '../../shared/material-module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    HeaderComponent
  ],
  exports:[HeaderComponent]
})
export class HeaderModule { }
