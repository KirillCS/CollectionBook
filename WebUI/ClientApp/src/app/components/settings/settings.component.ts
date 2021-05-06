import { Component, Inject } from '@angular/core';

import { API_URL, DEFAULT_AVATAR } from 'src/app/app-injection-tokens';
import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { SettingsService } from 'src/app/services/settings.service';
import { ProfileCoverSize } from '../ui/profile-cover/profile-cover.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  private user = new UserDto();

  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatarPath: string,
    private settingsService: SettingsService
  ) { 
    this.settingsService.user$.subscribe(user => {
      this.user = user;
    });
  }

  public get userCover() : UserCoverDto {
    return this.user as UserCoverDto;
  }

  public get login() : string {
    return this.user?.login;
  }

  
  public get profileCoverSize() : ProfileCoverSize {
    return ProfileCoverSize.Large
  }
  
}
