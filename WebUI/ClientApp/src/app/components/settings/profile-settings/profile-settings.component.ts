import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDto } from 'src/app/models/dtos/user/user.dto';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { ImageCropperDialogComponent, ImageCropperDialogData } from 'src/app/components/dialogs/image-cropper-dialog/image-cropper-dialog.component';
import { API_URL, DEFAULT_AVATAR, SUPPORTED_IMAGES_TYPES } from 'src/app/app-injection-tokens';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { Router } from '@angular/router';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {

  private user: UserDto;
  private subscription: Subscription;

  private _acceptFilesFormats: string;

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

  public get clearAvatarEnable(): boolean {
    return this.user?.avatarPath?.length > 0;
  }

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatarPath: string,
    @Inject(SUPPORTED_IMAGES_TYPES) private supportedImagesTypes: string[],
    private settingsService: SettingsService,
    private userService: UserService,
    private authService: AuthService,
    private authTokenService: AuthTokenService,
    private serverErrorsService: ServerErrorsService,
    private dialogService: DefaultDialogsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this._acceptFilesFormats = supportedImagesTypes.join(',');
    this.subscription = this.settingsService.user$.subscribe(user => {
      this.user = user;
      this.setForm(user);
    });
  }

  public get acceptFilesFormats(): string {
    return this._acceptFilesFormats;
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
    return this.user?.avatarPath?.length > 0 ? this.apiUrl + this.user.avatarPath : this.defaultAvatarPath;
  }

  public avatarSelected(files: FileList): void {
    if (!files.length) {
      return;
    }

    let file = files[0];
    if (!this.supportedImagesTypes.includes(file.type)) {
      this.dialogService.openInfoMessageDialog('Not supported format', 'File has not supported format. It must be image.');
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, true, 1, 512, true, 'Crop your profile avatar', 'Upload')
    });

    dialogRef.afterClosed().subscribe((avatarBlob: Blob) => {
      if (!avatarBlob) {
        return;
      }

      let avatar: any = avatarBlob;
      avatar.name = file.name;

      this.updateAvatar(<File>avatar);
    })
  }

  public resetAvatar(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Reset profile avatar?', 'Are you sure you want to reset profile avatar?');

    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (!yes) {
        return;
      }

      this.updateAvatar(null);
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.inProcess = true;
    this.userService.updateProfile(this.getRequest()).subscribe(
      () => {
        this.setUser();
        this.settingsService.update(this.user);
      },
      (errorResponse: HttpErrorResponse) => {
        this.inProcess = false;
        switch (errorResponse.status) {
          case 400:
            this.serverErrorsService.setFormErrors(this.form, errorResponse);
            break;
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Not authenticated', 'You must be authenticated to set up account profile');
            break;
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this.authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this.router.navigateByUrl('/');
            this.dialogService.openWarningMessageDialog('No access', 'Your account role does not allow change account profile.');
            break;
          case 404:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('User not found', 'User was not found. Maybe it was deleted');
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this.unknownError = true;
            break;
        }
      },
      () => {
        this.inProcess = false;
        this.snackBar.open('Profile was updated', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3500 });
      });
  }

  private updateAvatar(avatar: File): void {
    this.userService.updateAvatar(avatar).subscribe(
      newAvatarPath => this.user.avatarPath = newAvatarPath,
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 401:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('Failed to update a profile avatar', 'You must be authenticated to update your profile avatar.');
            break;
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this.authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this.router.navigateByUrl('/');
            this.dialogService.openWarningMessageDialog('No access', 'Your account role does not allow change account avatar.');
            break;
          case 404:
            this.authService.logout(true);
            this.dialogService.openWarningMessageDialog('User not found', 'Your account was not found. Maybe it was deleted.');
            break;
          case 405:
            this.authService.logout(true);
            this.dialogService.openBlockReasonDialog(JSON.parse(errorResponse.error).blockReason);
            break;
          default:
            this.dialogService.openWarningMessageDialog('Failed to update a profile avatar', 'Something went wrong while profile avatar was updating. Try update avatar again.');
            break;
        }
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
