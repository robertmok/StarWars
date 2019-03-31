import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { HomeComponent } from './pages/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // default route of the module
  { path: 'home', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
