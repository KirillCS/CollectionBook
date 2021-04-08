import { Component, Inject, Input } from '@angular/core';

import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { UserCollectionDto } from 'src/app/models/dtos/user-collections.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {

  @Input() public collection: UserCollectionDto;

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private collectionService: CollectionService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) { }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get currentUserId() : string {
    return this.currentUserService.currentUser?.id;
  }
  
  public get collectionCover(): string {
    if (!this.collection.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }

  
  public get starIcon() : string {
    if (this.collection.stars.some(s => s.userId === this.currentUserId)) {
      return 'star';
    }

    return 'star_outline';
  }
  

  public star(): void {
    this.collectionService.star(this.collection.id).subscribe(() => {})
  }
}
