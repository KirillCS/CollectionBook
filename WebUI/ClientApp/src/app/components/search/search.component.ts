import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ItemChangeEvent } from '../ui/menu/menu.component';

import { SearchGroupInStringFormat } from './search-group';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy {

  private readonly routerSub: Subscription;
  private readonly _menuItems = ['Collections', 'Items', 'Users'];
  private _selectedIndex = 0;

  public constructor(private router: Router) {
    this.routerSub = router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        let urlTree = this.router.parseUrl(event.url);
        let urlGroup = urlTree.root.children[PRIMARY_OUTLET];
        if (urlGroup && urlGroup.segments?.length >= 2) {
          let segment = urlGroup.segments[1].path;
          SearchGroupInStringFormat.forEach((v, k) => {
            if (segment === v) {
              this._selectedIndex = k;
            }
          })
        }
      });
  }

  public ngOnDestroy(): void {
    this.routerSub.unsubscribe();
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
