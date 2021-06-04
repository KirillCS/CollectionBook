import { Component } from '@angular/core';
import { Roles } from 'src/app/models/roles';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService
  ) { }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get isOwner(): boolean {
    return this.currentUserService.currentUser?.role == Roles.Owner;
  }
}
