import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Params } from '@angular/router';

import { API_URL, DEFAULT_COLLECTION_COVER, SEARCH_BY_KEY, SEARCH_STRING_KEY } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { SearchCriteriaInStringFormat, SearchCriterion } from '../../search/search-criterion';
import { StarToggledEventArgs } from '../star/star.component';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {

  @Input() public collection: CollectionDto;

  @Output() private starToggled = new EventEmitter<StarToggledEventArgs>();

  public constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string,
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string
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
  
  public get starsCount(): number {
    return this.collection.stars.length;
  }

  public getTagQueryParams(tag: string): Params {
    return {
      [this.searchStringKey]: tag,
      [this.searchByKey]: SearchCriteriaInStringFormat.get(SearchCriterion.Tags)
    }
  }
}
