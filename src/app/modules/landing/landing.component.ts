import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  landingFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,  private router: Router) { }

  ngOnInit() {
    this.landingFormGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  proceed() {
    if (this.landingFormGroup.valid) {
      if (typeof(Storage) !== 'undefined') {
        sessionStorage.setItem('username', this.landingFormGroup.get('name').value);
        this.router.navigate(['/home']);
      } else {
          alert ('Sorry, your browser does not support Web Storage ...');
      }
    } else {
      console.log('Invalid form');
    }
  }
}
