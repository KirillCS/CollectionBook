import { Component, Inject } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SEARCH_STRING_KEY } from 'src/app/app-injection-tokens';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public get currentUser(): UserLoginDto {
    return this.currentUserService.currentUser;
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public searchInputChanged(input: HTMLInputElement): void {
    let queryParams: Params = {
      [this.searchStringKey]: input.value
    };

    let searchGroupUrl = 'collections';
    this.route.url.subscribe(urlArray => {
      let url = urlArray[1];
      if (url) {
        searchGroupUrl = url.path;
      }
    });
    
    this.router.navigate(['/search', searchGroupUrl], { queryParams, queryParamsHandling: 'merge' });
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
