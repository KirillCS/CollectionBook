import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemChangeEvent } from '../ui/menu/menu.component';

import { SearchGroupInStringFormat } from './search-group';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {

  private readonly _menuItems = ['Collections', 'Items', 'Users'];
  private _selectedIndex: number;

  public constructor(route: ActivatedRoute, private router: Router) {
    route.firstChild.url.subscribe(urlArray => {
      let url = urlArray[0];
      this._selectedIndex = 0;
      if (!url) {
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

  public selectedMenuItemChanged(event: ItemChangeEvent): void {
    this.router.navigate(['/search', SearchGroupInStringFormat.get(event.index)], { queryParamsHandling: 'preserve' });
  }
}
