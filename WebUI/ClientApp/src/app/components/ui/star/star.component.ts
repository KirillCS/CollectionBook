import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
import { AuthService } from 'src/app/services/auth.service';

import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { StarService } from 'src/app/services/star.service';

export class StarToggledEventArgs {
  private _collectionId: number;
  private _newStatus: boolean;

  constructor(collectionId: number, newStatus: boolean) {
    this._collectionId = collectionId;
    this._newStatus = newStatus;
  }

  public get collectionId(): number {
    return this._collectionId;
  }

  public get newStatus(): boolean {
    return this._newStatus;
  }
}

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html'
})
export class StarComponent {

  private _isStarClicked = false;

  @Input('starred') private _starred: boolean;
  @Input('collectionId') private _collectionId: number;

  @Output('toggled') private _toggled = new EventEmitter<StarToggledEventArgs>();

  public constructor(
    private starService: StarService,
    private dialogsService: DefaultDialogsService,
    private authSerice: AuthService,
    private authTokenService: AuthTokenService
  ) { }

  public get starIcon(): string {
    if (this._starred) {
      return 'star';
    }

    return 'star_outline';
  }

  public get starred(): boolean {
    return this._starred;
  }

  public toggle(): void {
    if (this._isStarClicked) {
      return;
    }

    this._isStarClicked = true;
    this.starService.toggle(this._collectionId).subscribe(
      () => {
        this._starred = !this._starred;
        this._toggled.emit(new StarToggledEventArgs(this._collectionId, this._starred));
      },
      (errorResponse: HttpErrorResponse) => {
        this._isStarClicked = false;
        switch (errorResponse.status) {
          case 401:
            this.authSerice.logout();
            this.dialogsService.openWarningMessageDialog('Not authenticated', 'You must be authenticated to star collection.');
            break;
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this.authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this.authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this.dialogsService.openWarningMessageDialog('No access', 'You cannot star collection, because of your account role.');
            break;
          case 404:
            if (errorResponse.error.entityType == 'User') {
              this.authSerice.logout();
              this.dialogsService.openWarningMessageDialog('User not found', 'Your account was not found. Maybe it was deleted.');
              break;
            }
            
            this.dialogsService.openWarningMessageDialog('Collection not found', 'Collection was not found. Maybe it was deleted.');
            break;
          case 405:
            this.authSerice.logout();
            this.dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
        }

      },
      () => this._isStarClicked = false)
  }
}
