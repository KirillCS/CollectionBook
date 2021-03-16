import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher'
import { UserDto } from 'src/app/models/dtos/user.dto';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from 'src/app/components/dialogs/dialog/dialog.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public loginForm = new FormGroup({ login: new FormControl() });
  public emailForm = new FormGroup({ email: new FormControl('', Validators.email) });
  public matcher = new SubmitErrorStateMatcher();

  public user: UserDto;

  public inProcess = false;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private authTokenService: AuthTokenService,
    private dialog: MatDialog
  ) {
    this.subscription = settingsService.user$.subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.userService.getUser(this.currentUserService.currentUser.login).subscribe(user => {
      this.settingsService.update(user);
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loginSubmit(form: NgForm): void {
    if (this.loginForm.invalid) {
      return;
    }

    let control = this.loginForm.get('login');
    if (control.value == this.user.login) {
      control.setErrors({ using: true });

      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      position: { top: '30vh' },
      data: {
        header: 'Are you sure?',
        message: `Are you sure you want to change login from ${this.user.login} to ${control.value}? Links to your profile will be broken.`,
        positiveButtonName: 'Yes',
        negativeButtonName: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result == 'No') {
        return;
      }

      this.userService.updateLogin({ login: control.value }).subscribe(response => {
        this.authTokenService.setToken(response.accessToken);
        this.user.login = control.value;
        this.settingsService.update(this.user);

      }, (errorResponse: HttpErrorResponse) => {

      }, () => {
        form.resetForm();
      });
    });
  }

  public emailSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }
  }
}
