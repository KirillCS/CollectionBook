import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent implements OnInit {
  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    oldPassword: new FormControl(),
    newPassword: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  public hideOldPassword = true;
  public hideNewPassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;

  public get oldPassword() : AbstractControl {
    return this.form.get('oldPassword');
  }

  public get newPassword() : AbstractControl {
    return this.form.get('newPassword');
  }

  public get passwordConfirmation() : AbstractControl {
    return this.form.get('passwordConfirmation');
  }

  constructor() { }

  ngOnInit(): void {
  }

  public submit(): void {

  }
}
