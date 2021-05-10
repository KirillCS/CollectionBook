import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { SettingsService } from 'src/app/services/settings.service';
import { ItemChangeEvent } from '../ui/menu/menu.component';
import { ProfileCoverSize } from '../ui/profile-cover/profile-cover.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  private user = new UserDto();
  private readonly _title = 'Account settings';
  private readonly _items = ['Profile', 'Account', 'Security'];
  private _selectedIndex = 0;

  public constructor(private settingsService: SettingsService, private router: Router, route: ActivatedRoute) {
    this.settingsService.user$.subscribe(user => {
      this.user = user;
    });
    
    let url = router.url;
    url = url.slice(url.lastIndexOf('/') + 1, url.length);
    this._selectedIndex = this.getMenuItemIndex(url);
  }

  public get userCover(): UserCoverDto {
    return this.user as UserCoverDto;
  }

  public get login(): string {
    return this.user?.login;
  }

  public get profileCoverSize(): ProfileCoverSize {
    return ProfileCoverSize.Large
  }

  public get title(): string {
    return this._title
  }

  public get items(): string[] {
    return this._items;
  }

  public get selectedIndex(): number {
    return this._selectedIndex;
  }

  public menuItemChanged(event: ItemChangeEvent): void {
    this.router.navigate(['/settings', this.getRoute(event.index)]);
  }

  private getRoute(menuItemIndex: number): string {
    switch (menuItemIndex) {
      case 0:
        return 'profile';
      case 1:
        return 'account';
      case 2:
        return 'security';
      default:
        return '';
    }
  }

  private getMenuItemIndex(route: string): number {
    switch (route) {
      case 'profile':
        return 0;
      case 'account':
        return 1;
      case 'security':
        return 2;
      default:
        return -1;
    }
  }
}
