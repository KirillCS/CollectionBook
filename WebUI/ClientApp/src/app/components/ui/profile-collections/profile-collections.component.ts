import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { StarToggledEventArgs } from '../star/star.component';

export class GetCollectionsData {
  public login: string;
  public searchString: string;
  public pageSize: number;
  public pageIndex: number;
}

@Component({
  selector: 'app-profile-collections',
  templateUrl: './profile-collections.component.html'
})
export class ProfileCollectionsComponent implements OnInit {

  private profileLogin: string;
  private searchString = '';
  @Input('collectionsLoaded') private _collectionsLoaded: boolean;

  @Output() public getCollections = new EventEmitter<GetCollectionsData>();
  @Output() private collectionStarToggled = new EventEmitter<StarToggledEventArgs>();

  @Input() public collections = new Array<CollectionDto>();
  @Input() public totalCount = -1;

  public pageSize = 12;
  public pageIndex = 0;

  public constructor(private route: ActivatedRoute, private currentUserService: CurrentUserService) { }

  public get isOwner(): boolean {
    return this.currentUserService?.currentUser?.login === this.profileLogin;
  }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.profileLogin = params.get('login');
      this.emit();
    });
  }

  public searchInputChanged(searchString: string): void {
    this.pageIndex = 0;
    this.searchString = searchString;
    this.emit();
  }

  public pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.emit();
  }

  public emit(): void {
    this.getCollections.emit({
      login: this.profileLogin,
      searchString: this.searchString,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    });
  }
}
