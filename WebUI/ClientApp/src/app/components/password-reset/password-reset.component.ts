import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { ResetPasswordRequest } from 'src/app/models/requests/user/reset-password.request';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  private id: string;
  private token: string;

  public form = new FormGroup({
    password: new FormControl(),
    passwordConfirmation: new FormControl()
  });
  public matcher = new SubmitErrorStateMatcher();

  public hidePassword = true;
  public hidePasswordConfirmation = true;

  public inProcess = false;

  public constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private serverErrorsService: ServerErrorsService,
    private dialogService: DefaultDialogsService
  ) { }

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  public get passwordConfirmation(): AbstractControl {
    return this.form.get("passwordConfirmation");
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

  public ngOnInit(): void {
    let sub = this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.token = params.get('token');
    }, () => { }, () => sub.unsubscribe());
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.passwordConfirmation.value != this.password.value) {
      this.passwordConfirmation.setErrors({ mismatch: true });

      return;
    }

    this.inProcess = true;
    let request: ResetPasswordRequest = {
      id: this.id,
      token: this.token,
      password: this.password.value,
      passwordConfirmation: this.passwordConfirmation.value
    }
    this.userService.resetPassword(request).subscribe(
      () => { },
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 400:
            this.serverErrorsService.setFormErrors(this.form, errorResponse);
            break;
          case 404:
            this.router.navigate(['']);
            this.dialogService.openWarningMessageDialog('Ошибка сброса пароля', 'При сбросе пароля произошла ошибка: пользователь не найден. Это может быть из-за опечаток в ссылке. В таком случае проверьте ссылку или отправьте письмо снова.');
            break;
          default:
            this.router.navigate(['']);
            this.dialogService.openWarningMessageDialog('Ошибка сброса пароля', 'Токен сброса пароля не валиден. Повторите операцию сброса заново.');
            break;
        }

        this.inProcess = false;
      },
      () => {
        this.router.navigate(['']);
        this.dialogService.openSuccessMessageDialog('Пароль успешно обновлен', 'Теперь вы можете войти в свою учетную запись, используя новый пароль.');
      })
  }
}
