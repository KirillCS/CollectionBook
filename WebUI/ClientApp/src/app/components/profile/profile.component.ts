import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { API_URL, DEFAULT_AVATAR } from 'src/app/app-injection-tokens';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private _contentLoaded = false;

  public user = new UserDto();
  public isOwner = false;

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatarPath: string,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: CurrentUserService,
    private dialogService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let login = params.get('login');
      this.userService.get(login).subscribe(
        user => {
          this.user = user;
          this.isOwner = user.id == this.currentUserService?.currentUser?.id;
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 404) {
            this.router.navigateByUrl('**', { skipLocationChange: true });
            return;
          }
        },
        () => this._contentLoaded = true);
    });
  }

  public get contentLoaded(): boolean {
    return this._contentLoaded;
  }

  public getAvatarPath(): string {
    return this.user?.avatarPath?.length > 0 ? this.apiUrl + this.user.avatarPath : this.defaultAvatarPath;
  }

  public isOthersDataVisible(): boolean {
    return this.user.location?.length > 0 ||
      this.user.isEmailVisible ||
      this.user.websiteUrl?.length > 0 ||
      this.user.telegramLogin?.length > 0 ||
      this.user.instagramLogin?.length > 0;
  }
}
