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
          this.errorMessage = 'Verification token is invalid.';

          return;
        }

        if (errorResponse.status == 404) {
          this.errorMessage = 'User was not found. It could be because link is broken or user was deleted.';

          return;
        }

        this.errorMessage = 'Something went wrong on the server.';
      })
    })
  }

}
