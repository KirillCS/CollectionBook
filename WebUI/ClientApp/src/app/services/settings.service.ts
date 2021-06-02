import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDto } from 'src/app/models/dtos/user/user.dto';

import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from './default-dialogs.service';

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
    private dialogsService: DefaultDialogsService
  ) { }

  public updateFromServer(): void {
    this.userService.get(this.currentUserService.currentUser.login).subscribe(
      user => this.userSource.next(user),
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 404) {
          this.authService.logout();
          this.dialogsService.openWarningMessageDialog('User not found', 'User was not found. Maybe it was deleted');
          return;
        }
        
        this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server. Maybe updating page will be able to help.');
      })
  }

  public update(user: UserDto): void {
    this.userSource.next(user);
  }
}
