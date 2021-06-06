import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router } from '@angular/router';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { AuthService } from 'src/app/services/auth.service';
import 'src/app/extensions/string-extensions';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { RegisterRequest } from 'src/app/models/requests/auth/register.request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy {

  public matcher = new SubmitErrorStateMatcher();
  public form = new FormGroup({
    login: new FormControl(),
    email: new FormControl('', Validators.email),
    password: new FormControl(),
    passwordConfirmation: new FormControl()
  });

  public hidePassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;
  public unknownError = false;

  //#region controls getters
  public get login(): AbstractControl {
    return this.form.get('login');
  }

  public get email(): AbstractControl {
    return this.form.get('email');
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  public get passwordConfirmation(): AbstractControl {
    return this.form.get('passwordConfirmation')
  }
  //#endregion

  //#region controls errors messages
  public get loginErrorMessage(): string {
    if (this.login.hasError('required')) {
      return 'Введите логин';
    }

    if (this.login.hasError('pattern')) {
      return 'Логин может содержать только английские буквы, цифры и символы: _ - .';
    }

    if (this.login.hasError('maxlength')) {
      return 'Логин не может быть длинее 256 символов';
    }

    return '';
  }

  public get emailErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'Введите адрес электронной почты';
    }

    if (this.email.hasError('email')) {
      return 'Введенный адрес электронной почты не валиден';
    }

    return '';
  }

  public get passwordErrorMessage(): string {
    if (this.password.hasError('required')) {
      return 'Введите пароль';
    }

    if (this.password.hasError('minlength')) {
      return 'Пароль должен содержать не менее 6 символов';
    }

    if (this.password.hasError('pattern')) {
      return 'Пароль должен содержать как минимум одну английскую букву в нижнем регистре, одну - в верхнем и одну цифру';
    }

    return '';
  }

  public get passwordConfirmationErrorMessage(): string {
    if (this.passwordConfirmation.hasError('required')) {
      return 'Подтвердите пароль';
    }

    if (this.passwordConfirmation.hasError('mismatch')) {
      return 'Пароли не совпадают';
    }

    return '';
  }
  //#endregion

  public constructor(
    private authService: AuthService,
    private router: Router,
    private serverErrorsService: ServerErrorsService
  ) { }

  public ngOnDestroy(): void {
    this.form.reset();
  }

  public formChanged() {
    this.unknownError = false;
  }

  public submit(): void {
    this.unknownError = false;
    if (this.form.invalid) {
      return;
    }

    if (this.password.value != this.passwordConfirmation.value) {
      this.passwordConfirmation.setErrors({ mismatch: true });
      return;
    }

    this.inProcess = true;
    let request: RegisterRequest = {
      login: this.login.value,
      email: this.email.value,
      password: this.password.value,
      passwordConfirmation: this.passwordConfirmation.value
    }
    this.authService.register(request).subscribe(
      response => {
        let queryParams: Params = { id: response.id, email: response.email };
        this.router.navigate(['emailconfirmation'], { queryParams });
      },
      (errorResponse: HttpErrorResponse) => {
        this.inProcess = false;
        if (errorResponse.status == 400) {
          this.serverErrorsService.setFormErrors(this.form, errorResponse);
          return;
        }

        this.unknownError = true;
      },
      () => this.inProcess = false);
  }
}
