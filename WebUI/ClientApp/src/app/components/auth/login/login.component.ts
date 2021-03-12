import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Params, Router } from '@angular/router';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    login: new FormControl(),
    password: new FormControl(),
    rememberMe: new FormControl()
  });

  public hidePassword = true;
  public inProcess = false;
  public invalid = false;
  public unknownError = false;

  public get login(): AbstractControl {
    return this.form.get('login');
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }


  public get rememberMe(): AbstractControl {
    return this.form.get('rememberMe');
  }


  constructor(private authService: AuthService, private router: Router) { }

  public formChanged(): void {
    this.invalid = false;
    this.unknownError = false;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.inProcess = true;
    this.authService.login({ login: this.login.value, password: this.password.value }, this.rememberMe.value ?? false)
      .subscribe(() => { }, errorResponse => {
        this.inProcess = false;
        if (errorResponse?.status == 401) {
          this.invalid = true;
          return;
        }

        if (errorResponse?.status == 403) {
          let queryParams: Params = { id: errorResponse.error.id, email: errorResponse.error.email };
          this.router.navigate(['emailconfirmation'], { queryParams });

          return;
        }

        this.unknownError = true;
      });
  }
}
