import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmailConfirmationService } from 'src/app/services/email-confirmation.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  private _id = '';

  public email = '';
  public sendLinkEnable = true; 

  constructor(private route: ActivatedRoute, private emailService: EmailConfirmationService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this._id = params.get('id');
      this.email = params.get('email');
    })
  }

  public sendEmail(): void {
    if (!this.sendLinkEnable) {
      return;
    }

    this.sendLinkEnable = false;
    this.emailService.sendConfirmationMessage(this._id).subscribe(() => {}, error => console.log(error), () => {
      setTimeout(() => {
        this.sendLinkEnable = true;
      }, 300000);
    });
  }
}
