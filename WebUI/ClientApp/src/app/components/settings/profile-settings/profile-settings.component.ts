import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { UpdateProfileRequest } from 'src/app/models/requests/user/update-profile.request';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDto } from 'src/app/models/dtos/user.dto';
import { ServerErrorsService } from 'src/app/services/server-errors.service';
import { ImageCropperDialogComponent, ImageCropperDialogData } from 'src/app/components/dialogs/image-cropper-dialog/image-cropper-dialog.component';
import { API_URL, DEFAULT_AVATAR_PATH } from 'src/app/app-injection-tokens';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

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
    return this.user?.avatarPath?.length > 0;
  }
  

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR_PATH) private defaultAvatarPath: string,
    private settingsService: SettingsService,
    private userService: UserService,
    private authService: AuthService,
    private serverErrorsService: ServerErrorsService,
    private dialogService: DefaultDialogsService,
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
    return this.user?.avatarPath?.length > 0 ? this.apiUrl + this.user.avatarPath : this.defaultAvatarPath;
  }

  public selectAvatar(): void {
    this.avatarInput.nativeElement.click();
  }

  public avatarSelected(files: FileList): void {
    if (!files.length) {
      return;
    }

    let file = files[0];
    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(file, true, 1, 512, true, 'Upload')
    });

    dialogRef.afterClosed().subscribe((avatarBlob: Blob) => {
      
      if (!avatarBlob) {
        return;
      }

      let avatar: any = avatarBlob;
      avatar.name = file.name;

      this.userService.updateAvatar(<File>avatar).subscribe(() => {
        this.dialogService.openSuccessMessageDialog('Profile avatar updated', 'Profile avatar has been successfully updated. Reload the page to see the new profile avatar.');
      }, (errorResponse: HttpErrorResponse) => {

        if (errorResponse.status == 401) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('Failed to update a profile avatar', 'You must be authenticated to update your profile avatar.');

          return;
        }
        
        if (errorResponse.status == 404) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('User not found', 'Your account was not found. Maybe it was deleted.');

          return;
        }

        this.dialogService.openWarningMessageDialog('Failed to update a profile avatar', 'Something went wrong while profile avatar was updating. Try update avatar again.');
      });
    })
  }

  public resetAvatar(): void {
    let dialogRef = this.dialogService.openYesNoDialog('Reset profile avatar?', 'Are you sure you want to reset profile avatar?');

    dialogRef.afterClosed().subscribe((answer: string) => {
      if (answer === 'No') {
        return;
      }

      this.userService.resetAvatar().subscribe(() => {
        this.dialogService.openSuccessMessageDialog('Profile avatar reseted', 'Profile avatar has been successfully reseted. Reload the page to see the new profile avatar.');
      }, (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 401) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('Failed to reset a profile avatar', 'You must be authenticated to reset your profile avatar.');

          return;
        }

        if (errorResponse.status == 404) {
          this.authService.logout();
          this.dialogService.openWarningMessageDialog('User not found', 'Your account was not found. Maybe it was deleted.');
          
          return;
        }
        
        this.dialogService.openWarningMessageDialog('Failed to reset a profile avatar', 'Something went wrong while profile avatar was resetting. Try reset avatar again.');
      });
    });
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
        this.dialogService.openWarningMessageDialog('Not authenticated', 'You must be authenticated to set up account profile');

        return;
      }

      if (errorResponse.status == 404) {
        this.authService.logout();
        this.dialogService.openWarningMessageDialog('User not found', 'User was not found. Maybe it was deleted');

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
