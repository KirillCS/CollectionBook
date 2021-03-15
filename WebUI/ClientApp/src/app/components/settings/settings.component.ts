import { Component } from '@angular/core';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { AvatarService } from 'src/app/services/avatar.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public user = new UserDto();

  constructor(private settingsService: SettingsService, private avatarService: AvatarService) { 
    this.settingsService.user$.subscribe(user => {
      this.user = user;
    })
  }

  
  public getAvatarPath(): string {
    return this.avatarService.getFullAvatarPath(this.user?.avatarPath);
  }
}
