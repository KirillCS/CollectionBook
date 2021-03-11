import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { LoginDialogComponent } from 'src/app/components/dialogs/login/login-dialog.component';
import { RegisterDialogComponent } from 'src/app/components/dialogs/register/register-dialog.component';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserDto } from 'src/app/models/dtos/user.dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private dialog: MatDialog, 
    private authService: AuthService, 
    private currentUserService: CurrentUserService
  ) { }

  public get currentUser() : UserDto {
    return this.currentUserService.currentUser;
  }
  
  public openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, { width: '450px' });
  }

  public openSignupDialog(): void {
    this.dialog.open(RegisterDialogComponent, { width: '450px' });
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public logout(): void {
    this.authService.logout();
  }
}
