import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LandingComponent } from './modules/landing/landing.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', loadChildren: './modules/home/home.module#HomeModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'landing' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
