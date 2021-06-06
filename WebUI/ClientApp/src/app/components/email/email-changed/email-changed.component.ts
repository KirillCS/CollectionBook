import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';

@Component({
  selector: 'app-email-changed',
  templateUrl: './email-changed.component.html',
  styleUrls: ['../email-components.styles.scss']
})
export class EmailChangedComponent implements OnInit {

  public changed: boolean;
  public email = '';
  public errorMessage = '';

  public constructor(private route: ActivatedRoute, private emailService: EmailConfirmationService) { }

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let id = params.get('id');
      let email = params.get('email');
      let token = params.get('token');

      this.emailService.confirmEmailUpdating({ id, email, token }).subscribe(() => {
        this.email = email;
        this.changed = true;

      }, (errorResponse: HttpErrorResponse) => {
        this.changed = false;
        if (errorResponse.status == 400) {
          this.errorMessage = `токен не валиден или адрес электронной почты ${email} уже используется другим пользователем. Попробуйте повторить процесс снова.`;

          return;
        }

        if (errorResponse.status == 404) {
          this.errorMessage = 'пользователь не найден. Это может быть из-за опечаток в ссылке. В таком случае проверьте ссылку или повторите снова.';

          return;
        }

        this.errorMessage = 'неизвестная ошибка.';
      })
    })
  }
}
