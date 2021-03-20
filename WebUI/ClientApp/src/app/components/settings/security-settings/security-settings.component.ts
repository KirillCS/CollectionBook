import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html'
})
export class SecuritySettingsComponent implements OnInit {
  
  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    currentPassword: new FormControl(),
    newPassword: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  public hideCurrentPassword = true;
  public hideNewPassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;

  public get currentPassword() : AbstractControl {
    return this.form.get('currentPassword');
  }

  public get newPassword() : AbstractControl {
    return this.form.get('newPassword');
  }

  public get passwordConfirmation() : AbstractControl {
    return this.form.get('passwordConfirmation');
  }

  public constructor(private settingsService: SettingsService) { }

  public ngOnInit(): void {
    this.settingsService.updateFromServer();
  }

  public submit(): void {

  }
}
