import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  private isStarClicked = false;

  @Input() private starred: boolean;
  @Input() private collectionId: number;

  @Output() private toggled = new EventEmitter<StarToggledEventArgs>();

  public constructor(private starService: StarService, private dialogsService: DefaultDialogsService) { }

  public get starIcon(): string {
    if (this.starred) {
      return 'star';
    }

    return 'star_outline';
  }

  public toggle(): void {
    if (this.isStarClicked) {
      return;
    }

    this.isStarClicked = true;
    this.starService.toggle(this.collectionId).subscribe(() => {
      this.starred = !this.starred;
      this.toggled.emit(new StarToggledEventArgs(this.collectionId, this.starred));
    }, (errorResponse: HttpErrorResponse) => {
      this.isStarClicked = false;
      if (errorResponse.status == 401) {
        this.dialogsService.openWarningMessageDialog('Not authenticated', 'You must be authenticated to star collection.');
        return;
      }

      if (errorResponse.status == 404) {
        this.dialogsService.openWarningMessageDialog('Collection not found', 'Collection was not found. Maybe it was deleted.');
        return;
      }
    }, () => this.isStarClicked = false)
  }
}
