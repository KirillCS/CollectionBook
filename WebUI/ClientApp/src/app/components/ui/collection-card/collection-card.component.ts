import { Component, Inject, Input } from '@angular/core';

import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { UserCollectionDto } from 'src/app/models/dtos/user-collections.dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {

  @Input() public collection: UserCollectionDto;

  public constructor(
    private authService: AuthService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) { }

  public getCollectionCover(coverPath: string): string {
    if (!coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + coverPath;
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
