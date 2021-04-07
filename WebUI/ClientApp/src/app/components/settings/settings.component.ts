import { Component, Inject } from '@angular/core';

import { API_URL, DEFAULT_AVATAR } from 'src/app/app-injection-tokens';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public user = new UserDto();

  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatarPath: string,
    private settingsService: SettingsService
  ) { 
    this.settingsService.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  public getAvatarPath(): string {
    return this.user?.avatarPath?.length > 0 ? this.apiUrl + this.user.avatarPath : this.defaultAvatarPath;
  }
}
