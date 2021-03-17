import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';

@Component({
  selector: 'app-email-changed',
  templateUrl: './email-changed.component.html',
  styleUrls: ['./email-changed.component.scss']
})
export class EmailChangedComponent implements OnInit {

  public success: boolean;
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
        this.success = true;
      }, (errorResponse: HttpErrorResponse) => {
        this.success = false;
        if (errorResponse.status == 400) {
          this.errorMessage = 'Link is broken: email has wrong format.';

          return;
        }

        if (errorResponse.status == 404) {
          this.errorMessage = 'User is not found. It could be because link is broken or user was deleted.';

          return;
        }

        this.errorMessage = 'Token is invalid;'
      })
    })
  }

}
