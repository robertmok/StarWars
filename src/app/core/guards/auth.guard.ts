import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard#canActivate called');
    // Check browser support
    if (typeof(Storage) !== 'undefined') {
        // Retrieve
        if (sessionStorage.getItem('username') !== null) {
            return true;
        } else {
          this.router.navigate(['/landing']);
          return false;
        }
    } else {
        alert ('Sorry, your browser does not support Web Storage ...');
        return false;
    }
  }
}