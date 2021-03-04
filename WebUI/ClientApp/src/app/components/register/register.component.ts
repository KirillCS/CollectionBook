import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';
import { AuthService } from 'src/app/services/auth.service';

import 'src/app/extensions/string-extensions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public matcher = new DefaultErrorStateMatcher();
  public form = new FormGroup({
    login: new FormControl(),
    password: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  public hidePassword = true;
  public hidePasswordConfirmation = true;
  public inProcess = false;
  public unknownError = false;

  public get login(): AbstractControl {
    return this.form.get('login');
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  public get passwordConfirmation(): AbstractControl {
    return this.form.get('passwordConfirmation')
  }

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  public formChanged() {
    this.unknownError = false;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.password.value != this.passwordConfirmation.value) {
      this.passwordConfirmation.setErrors({ mismatch: true });
      return;
    }

    this.inProcess = true
    this.authService.register({ login: this.login.value, password: this.password.value, passwordConfirmation: this.passwordConfirmation.value })
      .subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 400) {
          let errors = errorResponse.error.errors;
          Object.keys(errors).forEach(errorKey => {
            let control = this.form.get(errorKey.toCamelCase());
            if (control) {
              control.setErrors({ serverErrors: errors[errorKey] });
            }
          });
        } else {
          this.unknownError = true;
        }

        this.inProcess = false;
      }, () => this.router.navigate(['']));
  }
}
