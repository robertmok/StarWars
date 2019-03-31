import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { MaterialModule } from './shared/material-module';
import { RouterModule } from '@angular/router';

// import { AppRoutingModule } from './app-routing.module';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { LandingComponent } from './modules/landing/landing.component';
import { SwapiService } from './core/services/swapi.service';
import { AuthGuard } from './core/guards/auth.guard';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    routing,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    SwapiService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
