import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { AuthService } from 'src/app/services/auth.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public form = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    biography: new FormControl(),
    location: new FormControl(),
    websiteUrl: new FormControl(),
    telegramLogin: new FormControl(),
    instagramLogin: new FormControl(),
  });
  public matcher = new DefaultErrorStateMatcher();

  public unknownError = false;
  public inProcess = false;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private authService: AuthService,
    private diaolog: MatDialog
  ) {
    this.subscription = this.settingsService.user$.subscribe(user => {
      this.form.get('firstName').setValue(user.firstName);
      this.form.get('lastName').setValue(user.lastName);
      this.form.get('biography').setValue(user.biography);
      this.form.get('location').setValue(user.location);
      this.form.get('websiteUrl').setValue(user.websiteUrl);
      this.form.get('telegramLogin').setValue(user.telegramLogin);
      this.form.get('instagramLogin').setValue(user.instagramLogin);
    });
  }

  public ngOnInit(): void {
    this.userService.getProfile(this.currentUserService.currentUser?.login).subscribe(response => {
      this.settingsService.update(response);
    }, (errorResponse: HttpErrorResponse) => {
      this.authService.logout();
      if (errorResponse.status == 401) {
        this.diaolog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Not authenticated',
            message: 'You must be authenticated to set up a profile',
            buttonName: 'Close'
          }
        });

        return;
      }

      if (errorResponse.status == 404) {
        this.diaolog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Account not found',
            message: 'Your account was not found. Maybe it was deleted',
            buttonName: 'Close'
          }
        });

        return;
      }

      this.diaolog.open(MessageDialogComponent, { width: '500px', position: { top: '30vh' } });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public formChanged(): void {
    this.unknownError = false;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    let request: UpdateProfileRequest = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      biography: this.form.get('biography').value,
      location: this.form.get('location').value,
      websiteUrl: this.form.get('websiteUrl').value,
      telegramLogin: this.form.get('telegramLogin').value,
      instagramLogin: this.form.get('instagramLogin').value,
    }

    this.inProcess = true;
    this.userService.updateProfile(request).subscribe(response => {
      this.settingsService.update(response);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 400) {
        let errors = errorResponse.error.errors;
        Object.keys(errors).forEach(errorKey => {
          let control = this.form.get(errorKey.toCamelCase());
          if (control) {
            control.setErrors({ serverErrors: errors[errorKey] });
          }
        });

        this.inProcess = false;
        return;
      }

      if (errorResponse.status == 401) {
        this.authService.logout();
        this.diaolog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Not authenticated',
            message: 'You must be authenticated to set up a profile',
            buttonName: 'Close'
          }
        });

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.diaolog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Account not found',
            message: 'Your account was not found. Maybe it was deleted',
            buttonName: 'Close'
          }
        });

        return;
      }
      this.inProcess = false;
    }, () => this.inProcess = false);
  }
}
