import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  public matcher = new DefaultErrorStateMatcher();
  public form = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    location: new FormControl()
  });

  public unknownError = false;
  public inProcess = false;

  public get firstName() : AbstractControl {
    return this.form.get('firstName');
  }
  
  public get lastName() : AbstractControl {
    return this.form.get('lastName');
  }
  
  public get location() : AbstractControl {
    return this.form.get('location');
  }

  constructor() { }

  ngOnInit(): void {
  }

  public formChanged(): void {
    this.unknownError = false;
  }

  public submit(): void {

  }
}
