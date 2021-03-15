import { Inject, Injectable } from '@angular/core';
import { API_URL, AVATARS_PATH, DEFAULT_AVATAR_PATH } from 'src/app/app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(AVATARS_PATH) private avatarsPath: string,
    @Inject(DEFAULT_AVATAR_PATH) private defaultAvatarPath: string
  ) { }

  public getFullAvatarPath(avatarPath: string): string {
    if (avatarPath) {
      return `${this.apiUrl}${this.avatarsPath}${avatarPath}`;
    }

    return this.defaultAvatarPath;
  }
}
