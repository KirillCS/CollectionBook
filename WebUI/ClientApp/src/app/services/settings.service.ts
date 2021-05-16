import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { UserDto } from 'src/app/models/dtos/user/user.dto';

import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private userSource = new Subject<UserDto>();

  public user$ = this.userSource.asObservable();

  public constructor(
    private userService: UserService,
    private currentUserService: CurrentUserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  public updateFromServer(): void {
    this.userService.get(this.currentUserService.currentUser.login).subscribe(response => {
      this.userSource.next(response);

    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 401) {
        this.authService.logout();
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'Not authenticated',
            message: 'You must be authenticated to set up account profile',
            buttonName: 'Close'
          }
        });

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.dialog.open(MessageDialogComponent, {
          width: '500px',
          position: { top: '30vh' },
          data: {
            type: MessageDialogType.Warning,
            header: 'User not found',
            message: 'User was not found. Maybe it was deleted',
            buttonName: 'Close'
          }
        });

        return;
      }

      this.dialog.open(MessageDialogComponent, {
        width: '500px',
        position: { top: '30vh' },
        data: {
          type: MessageDialogType.Warning,
          header: 'Something went wrong',
          message: 'Something went wrong on the server. Maybe updating page will be able to help.',
          buttonName: 'Close'
        }
      });
    })
  }

  public update(user: UserDto): void {
    this.userSource.next(user);
  }
}
