import { Component, Inject, OnInit } from '@angular/core';

import { API_URL, DEFAULT_AVATAR } from 'src/app/app-injection-tokens';
import { StarNotificationDto } from 'src/app/models/dtos/star-notification.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications-column',
  templateUrl: './notifications-column.component.html',
  styleUrls: ['./notifications-column.component.scss']
})
export class NotificationsColumnComponent implements OnInit {

  private stars = new Array<StarNotificationDto>();

  public constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatar: string
  ) { }

  public get starsNotifications(): StarNotificationDto[] {
    return this.stars;
  }

  public ngOnInit(): void {
    this.getStars();
  }

  public getFullAvatarPath(avatar: string): string {
    return !avatar ? this.defaultAvatar : `${this.apiUrl}${avatar}`;
  }

  private getStars(): void {
    this.userService.getStarsNotifications(
      this.currentUserService.currentUser?.login,
      {
        pageIndex: 0,
        pageSize: 10
      }
    ).subscribe(list => {
      this.stars.push(...list.items);
    })
  }
}
