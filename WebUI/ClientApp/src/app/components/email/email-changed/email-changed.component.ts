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
          this.errorMessage = 'This could be if email is already in use by another user, or email has already updated or simply verification token is invalid. Try update account email again.';

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
