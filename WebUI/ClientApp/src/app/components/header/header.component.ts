import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserDto } from 'src/app/models/dtos/user.dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private currentUserService: CurrentUserService) { }

  public get currentUser() : UserDto {
    return this.currentUserService.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public logout(): void {
    this.authService.logout();
  }
}
