import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['../email-components.styles.scss']
})
export class EmailConfirmedComponent implements OnInit {

  public confirmed: boolean;
  public errorMessage = '';

  public constructor(
    private route: ActivatedRoute,
    private emailService: EmailConfirmationService,
    private authTokenService: AuthTokenService
  ) { }

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let id = params.get('id');
      let token = params.get('token');
      this.emailService.confirmEmail({ id, token }).subscribe((response: LoginResponse) => {
        this.confirmed = true;
        this.authTokenService.setToken(response.accessToken, false);

      }, (errorResponse: HttpErrorResponse) => {
        this.confirmed = false;
        if (errorResponse.status == 400) {
          this.errorMessage = 'верификационный токен не валиден.';
          return;
        }

        if (errorResponse.status == 404) {
          this.errorMessage = 'пользователь не найден. Это может быть из-за опечаток в ссылке. В таком случае проверьте ссылку или отправьте письмо снова.';
          return;
        }

        this.errorMessage = 'неизвестная ошибка.';
      })
    })
  }

}
