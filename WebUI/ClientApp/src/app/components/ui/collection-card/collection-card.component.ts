import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { UserLoginDto } from 'src/app/models/dtos/user-login.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { StarChangedEvent } from '../star/star.component';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {

  @Input() public collection: CollectionDto;

  @Output() public starChanged = new EventEmitter<StarChangedEvent>();

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
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

  public get starred(): boolean {
    return this.collection.stars.some(s => s.userId === this.currentUser?.id)
  }
}
