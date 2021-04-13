import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';

import { CollectionService } from 'src/app/services/collection.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html'
})
export class StarComponent {

  private isStarClicked = false;

  @Input() public starred: boolean;
  @Input() public collectionId: number;

  public constructor(private collectionService: CollectionService, private dialogsService: DefaultDialogsService) { }

  public get starIcon(): string {
    if (this.starred) {
      return 'star';
    }

    return 'star_outline';
  }

  public star(): void {
    if (this.isStarClicked) {
      return;
    }

    this.isStarClicked = true;
    this.collectionService.star(this.collectionId).subscribe(() => {
      this.starred = !this.starred;
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
