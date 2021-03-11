import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { UserProfileDto } from 'src/app/models/dtos/user-profile.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { API_URL, AVATARS_PATH, DEFAULT_AVATAR_PATH } from 'src/app/app-injection-tokens';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile = new UserProfileDto();
  public currentUser: UserDto;
  private avatarsSource: string;

  constructor(
    @Inject(API_URL) apiUrl: string,
    @Inject(AVATARS_PATH) avatarPath: string,
    @Inject(DEFAULT_AVATAR_PATH) private defaultAvatarPath: string,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    currentUserService: CurrentUserService
  ) {
    this.currentUser = currentUserService.currentUser;
    this.avatarsSource = apiUrl + avatarPath;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let login = params.get('login');
      this.userService.getProfile(login).subscribe(profile => this.profile = profile, () => {
        this.router.navigateByUrl('**', {skipLocationChange: true});
      });
    })
  }

  public getAvatarPath(): string {
    return this.profile.avatarPath ? this.avatarsSource + this.profile.avatarPath : this.defaultAvatarPath;
  }

  public isOthersDataVisible(): boolean {
    return this.profile.location?.length > 0 ||
      this.profile.isEmailVisible?.length > 0 ||
      this.profile.websiteUrl?.length > 0 ||
      this.profile.telegramLogin?.length > 0 ||
      this.profile.instagramLogin?.length > 0;
  }
}
