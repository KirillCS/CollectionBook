import { Component, Inject } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { ActivatedRoute, Params, PRIMARY_OUTLET, Router } from '@angular/router';
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

    let urlTree = this.router.parseUrl(this.router.url);
    let urlGroup = urlTree.root.children[PRIMARY_OUTLET];
    let url = '/search/collections';
    if (urlGroup && urlGroup.segments[0].path === 'search') {
      url = `/${urlGroup.segments.join('/')}`;
    }
    
    this.router.navigate([url], { queryParams, queryParamsHandling: 'merge' });
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
