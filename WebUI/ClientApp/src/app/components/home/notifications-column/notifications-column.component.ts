import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { StarNotificationDto } from 'src/app/models/dtos/star/star-notification.dto';
import { PaginatedListRequest } from 'src/app/models/requests/paginated-list.request';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications-column',
  templateUrl: './notifications-column.component.html',
  styleUrls: ['./notifications-column.component.scss']
})
export class NotificationsColumnComponent implements OnInit {

  private stars = new Array<StarNotificationDto>();
  private _notificationsLoading: boolean;
  private pageSize = 5;
  private pageIndex = 0;
  private totalCount = 0;
  private notFound = false;

  public constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private dialogService: DefaultDialogsService
  ) { }

  public get starsNotifications(): StarNotificationDto[] {
    return this.stars;
  }

  public get notificationsLoading(): boolean {
    return this._notificationsLoading;
  }

  public get isButtonVisible(): boolean {
    return this.stars.length < this.totalCount;
  }

  public get starsNotFound(): boolean {
    return this.notFound;
  }

  public ngOnInit(): void {
    this.updateStars();
  }

  public loadMore(): void {
    if (this.notificationsLoading) {
      return;
    }

    this.pageIndex++;
    this.updateStars();
  }

  private updateStars(): void {

    this._notificationsLoading = true;
    let request: PaginatedListRequest = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };
    this.userService.getStarsNotifications(this.currentUserService.currentUser?.login, request).subscribe(
      list => {
        this.stars.push(...list.items);
        this.totalCount = list.totalCount;
      },
      (errorResponse: HttpErrorResponse) => {
        this.notFound = this.notFound = this.totalCount == 0;
        this._notificationsLoading = false;
        if (errorResponse.status == 404) {
          this.dialogService.openWarningMessageDialog('User not found', 'Your account was not found. Please try to log in again.');
          return;
        }

        this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while getting your collections. Reload the page and try again.');
      },
      () => {
        this.notFound = this.totalCount == 0;
        this._notificationsLoading = false;
      });
  }
}
