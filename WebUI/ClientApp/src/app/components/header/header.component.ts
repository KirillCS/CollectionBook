import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponentDialog } from '../dialogs/login/login-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openLoginDialog(): void {
    this.dialog.open(LoginComponentDialog, { disableClose: true, width: '450px' });
  }

  public openSignupDialog(): void {

  }
}
