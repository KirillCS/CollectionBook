import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { Router } from '@angular/router';
import { SearchGroup, SearchGroupsToStringsMap } from '../search/search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) { }

  public get currentUser(): UserLoginDto {
    return this.currentUserService.currentUser;
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public searchInputChanged(input: HTMLInputElement): void {
    if (!input.value) {
      return;
    }
    
    this.router.navigate(['/search'], {
      queryParams: {
        s: input.value,
        g: SearchGroupsToStringsMap.get(SearchGroup.Collections)
      }
    });
    input.value = '';
  }

  public logout(): void {
    this.authService.logout();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
