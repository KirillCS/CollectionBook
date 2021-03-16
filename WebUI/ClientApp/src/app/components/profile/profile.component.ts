import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user-login.dto';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user = new UserDto();
  public currentUser: UserLoginDto;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private avatarService: AvatarService,
    currentUserService: CurrentUserService
  ) {
    this.currentUser = currentUserService.currentUser;
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let login = params.get('login');
      this.userService.getUser(login).subscribe(profile => this.user = profile, () => {
        this.router.navigateByUrl('**', { skipLocationChange: true });
      });
    })
  }

  public getAvatarPath(): string {
    return this.avatarService.getFullAvatarPath(this.user?.avatarPath);
  }

  public isOthersDataVisible(): boolean {
    return this.user.location?.length > 0 ||
      this.user.isEmailVisible?.length > 0 ||
      this.user.websiteUrl?.length > 0 ||
      this.user.telegramLogin?.length > 0 ||
      this.user.instagramLogin?.length > 0;
  }
}
