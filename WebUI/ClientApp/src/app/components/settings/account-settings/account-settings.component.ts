import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher'
import { CurrentUserService } from 'src/app/services/current-user.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {

  public login: string;
  public email: string;
  private subscription: Subscription;

  public loginForm = new FormGroup({ login: new FormControl() });
  public emailForm = new FormGroup({ email: new FormControl('', Validators.email) });

  public matcher = new SubmitErrorStateMatcher();

  public inProcess = false;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private currentUserService: CurrentUserService
  ) {
    this.subscription = settingsService.user$.subscribe(user => {
      this.login = user.login;
      this.email = user.email;
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

  public loginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  }

  public emailSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }
  }
}
