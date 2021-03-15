import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.scss']
})
export class EmailConfirmedComponent implements OnInit {

  public confirmed: boolean = true;

  constructor(private route: ActivatedRoute, private emailService: EmailConfirmationService, private authTokenService: AuthTokenService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let id = params.get('id');
      let token = params.get('token');
      this.emailService.confirmEmail({ id, token }).subscribe(response => {
        this.confirmed = true;
        this.authTokenService.setToken(response.accessToken, false);
      }, errorResponse => {
        this.confirmed = false;
      })
    })
  }

}
