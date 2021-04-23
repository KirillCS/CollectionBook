import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL, DEFAULT_AVATAR, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { FullCollectionDto } from 'src/app/models/dtos/full-collection.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { StarChangedEvent } from '../ui/star/star.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  private collectionId: number;
  private collectionDto: FullCollectionDto;

  public constructor(
    route: ActivatedRoute,
    private collectionService: CollectionService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatar: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) {
    route.paramMap.subscribe(params => this.collectionId = parseInt(params.get("id")));
  }

  public get collection(): CollectionDto {
    return this.collectionDto?.collection;
  }

  public get collectionCover(): string {
    if (!this.collection?.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }

  public get starred(): boolean {
    return this.collection?.stars.some(s => s.userId === this.currentUserService.currentUser?.id)
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  
  public get showMenuButton() : boolean {
    return this.currentUserService.currentUser?.login == this.collection?.user?.login;
  }
  
  public ngOnInit(): void {
    this.getCollection();
  }

  public starStatusChanged(event: StarChangedEvent): void {
    if (event.newStatus && !this.starred) {
      this.collection.stars.push({ userId: this.currentUserService.currentUser?.id });
      return;
    }

    this.collection.stars = this.collection.stars.filter(s => s.userId == this.currentUserService.currentUser?.id);
  }

  private getCollection(): void {
    this.collectionService.getFullCollection(this.collectionId).subscribe(collection => this.collectionDto = collection)
  }
}
