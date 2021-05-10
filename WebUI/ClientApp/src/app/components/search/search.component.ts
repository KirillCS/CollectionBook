import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum SearchGroup {
  Collections,
  Items
}

export const SearchGroupsToStringsMap = new Map<SearchGroup, string>([
  [SearchGroup.Collections, 'c'],
  [SearchGroup.Items, 'i']
]);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private _searchString: string;

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParamMap.subscribe(params => {
      console.log(params.get('s'));
      console.log(params.get('g'));
    });
  }

  
  public get searchString() : string {
    return this._searchString;
  }
}
