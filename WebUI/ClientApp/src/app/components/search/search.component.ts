import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchGroupInStringFormat } from './search-group';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  private readonly _menuItems = ['Collections', 'Items', 'Users'];
  private _selectedIndex: number;

  public constructor(route: ActivatedRoute) {
    let urlSub = route.firstChild.url.subscribe(urlArray => {
      let url = urlArray[0];
      this._selectedIndex = 0;
      if (!url) {
        urlSub.unsubscribe();
        return;
      }

      SearchGroupInStringFormat.forEach((v, k) => {
        if (url.path === v) {
          this._selectedIndex = k;
        }
      })
    });
  }

  public get menuItems(): string[] {
    return this._menuItems;
  }

  public get selectedIndex(): number {
    return this._selectedIndex;
  }
}
