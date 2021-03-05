import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../dialogs/login/login-dialog.component';
import { RegisterDialogComponent } from '../dialogs/register/register-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private dialog: MatDialog) { }

  public openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, { width: '450px' });
  }

  public openSignupDialog(): void {
    this.dialog.open(RegisterDialogComponent, { width: '450px' });
  }
}
