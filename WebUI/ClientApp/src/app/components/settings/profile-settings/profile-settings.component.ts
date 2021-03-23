import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { MessageDialogComponent, MessageDialogType } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { ImageCropperDialogComponent, ImageCropperDialogData } from '../../dialogs/image-cropper-dialog/image-cropper-dialog.component';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {

  private user: UserDto;
  private subscription: Subscription;

  @ViewChild('avatarInput')
  private avatarInput: ElementRef<HTMLElement>;

  public form = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    biography: new FormControl(),
    location: new FormControl(),
    isEmailVisible: new FormControl(),
    websiteUrl: new FormControl(),
    telegramLogin: new FormControl(),
    instagramLogin: new FormControl(),
  });
  public matcher = new SubmitErrorStateMatcher();

  public unknownError = false;
  public inProcess = false;

  
  public get clearAvatarEnable() : boolean {
    return this.user?.avatarPath.length > 0;
  }
  

  public constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private authService: AuthService,
    private serverErrorsService: ServerErrorsService,
    private avatarService: AvatarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.subscription = this.settingsService.user$.subscribe(user => {
      this.user = user;
      this.setForm(user);
    });
  }

  public ngOnInit(): void {
    this.settingsService.updateFromServer();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public formChanged(): void {
    this.unknownError = false;
  }

  public getAvatarPath(): string {
    return this.avatarService.getFullAvatarPath(this.user?.avatarPath);
  }

  public selectAvatar(): void {
    this.avatarInput.nativeElement.click();
  }

  public avatarSelected(files: FileList): void {
    if (!files.length) {
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(files[0], true, 1, 512, true, 'Upload')
    });

    dialogRef.afterClosed().subscribe((avatar: Blob) => {
      console.log(avatar);
      
    })
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.inProcess = true;
    this.userService.updateProfile(this.getRequest()).subscribe(() => {
      this.setUser();
      this.settingsService.update(this.user);

    }, (errorResponse: HttpErrorResponse) => {
      this.inProcess = false;
      if (errorResponse.status == 400) {
        this.serverErrorsService.setFormErrors(this.form, errorResponse);

        return;
      }

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

      this.unknownError = true;

    }, () => {
      this.inProcess = false;
      this.snackBar.open('Profile was updated', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3500 });
    });
  }

  private setForm(user: UserDto): void {
    this.form.get('firstName').setValue(user.firstName);
    this.form.get('lastName').setValue(user.lastName);
    this.form.get('biography').setValue(user.biography);
    this.form.get('isEmailVisible').setValue(user.isEmailVisible);
    this.form.get('location').setValue(user.location);
    this.form.get('websiteUrl').setValue(user.websiteUrl);
    this.form.get('telegramLogin').setValue(user.telegramLogin);
    this.form.get('instagramLogin').setValue(user.instagramLogin);
  }

  private getRequest(): UpdateProfileRequest {
    return {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      biography: this.form.get('biography').value,
      location: this.form.get('location').value,
      isEmailVisible: this.form.get('isEmailVisible').value,
      websiteUrl: this.form.get('websiteUrl').value,
      telegramLogin: this.form.get('telegramLogin').value,
      instagramLogin: this.form.get('instagramLogin').value,
    };
  }

  private setUser(): void {
    this.user.firstName = this.form.get('firstName').value;
    this.user.lastName = this.form.get('lastName').value;
    this.user.biography = this.form.get('biography').value;
    this.user.location = this.form.get('location').value;
    this.user.isEmailVisible = this.form.get('isEmailVisible').value;
    this.user.websiteUrl = this.form.get('websiteUrl').value;
    this.user.telegramLogin = this.form.get('telegramLogin').value;
    this.user.instagramLogin = this.form.get('instagramLogin').value;
  }
}
