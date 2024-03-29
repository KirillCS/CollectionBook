import { Component, Inject, Input } from '@angular/core';

import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { API_URL, DEFAULT_AVATAR } from 'src/app/app-injection-tokens';

export enum ProfileCoverSize {
  Small,
  Medium,
  Large
}

@Component({
  selector: 'app-profile-cover',
  templateUrl: './profile-cover.component.html',
  styleUrls: ['./profile-cover.component.scss']
})
export class ProfileCoverComponent {

  @Input('user') private user: UserCoverDto;
  @Input() private size = ProfileCoverSize.Medium;

  public sizes = ProfileCoverSize;

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatarPath: string
  ) { }

  public get sizeClass(): string {
    switch(this.size) {
      case ProfileCoverSize.Large :
        return 'lg';
      case ProfileCoverSize.Small :
        return 'sm';
      default:
        return '';
    }
  }

  public get userLoaded(): boolean {
    return this.user?.login != null;
  }

  public get avatarPath(): string {
    if (this.user?.avatarPath?.length > 0) {
      return `${this.apiUrl}${this.user.avatarPath}`;
    }

    return this.defaultAvatarPath;
  }

  public get name() : string {
    let name = '';
    if (this.user?.firstName?.length > 0) {
      name += `${this.user.firstName} `;
    }

    if (this.user?.lastName?.length > 0) {
      name += this.user.lastName;
    }

    return name;
  }
  
  public get login() : string {
    return this.user?.login ?? '';
  }
}
