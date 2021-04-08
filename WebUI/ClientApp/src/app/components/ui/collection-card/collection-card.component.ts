import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input } from '@angular/core';

import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { UserCollectionDto } from 'src/app/models/dtos/user-collections.dto';
import { UserLoginDto } from 'src/app/models/dtos/user-login.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {

  private isStarClicked = false;

  @Input() public collection: UserCollectionDto;

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private collectionService: CollectionService,
    private dialogsService: DefaultDialogsService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) { }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get currentUser(): UserLoginDto {
    return this.currentUserService.currentUser;
  }

  public get collectionCover(): string {
    if (!this.collection.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }


  public get starIcon(): string {
    if (this.collection.stars.some(s => s.userId === this.currentUser?.id)) {
      return 'star';
    }

    return 'star_outline';
  }


  public star(): void {
    if (this.isStarClicked) {
      return;
    }

    this.isStarClicked = true;
    this.collectionService.star(this.collection.id).subscribe(() => {
      if (this.collection.stars.some(s => s.userId === this.currentUser?.id)) {
        this.collection.stars = this.collection.stars.filter(s => s.userId !== this.currentUser?.id);

        return;
      }

      this.collection.stars.push({ userId: this.currentUser?.id });
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
