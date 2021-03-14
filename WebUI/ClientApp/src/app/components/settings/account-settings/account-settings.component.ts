import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher'

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({ 
    login: new FormControl(),
    email: new FormControl('', Validators.email)
  });

  public inProcess = false;
  
  public get login() : AbstractControl {
    return this.form.get('login');
  }
  
  public get email() : AbstractControl {
    return this.form.get('email');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
