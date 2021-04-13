import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { GetProfileCollectionsRequest } from 'src/app/models/requests/user/get-profile-collections.request';
import { StarChangedEvent } from '../star/star.component';

@Component({
  selector: 'app-profile-collections',
  templateUrl: './profile-collections.component.html',
  styleUrls: ['./profile-collections.component.css']
})
export class ProfileCollectionsComponent implements OnInit {

  private searchTimeout: any;
  private profileLogin: string;

  @Output() public getCollections = new EventEmitter<GetProfileCollectionsRequest>();
  @Output() public collectionStarChanged = new EventEmitter<StarChangedEvent>();

  @Input() public collections = new Array<CollectionDto>();
  @Input() public totalCount = -1;

  public searchString = '';

  public pageSize = 12;
  public pageIndex = 0;

  public constructor(private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.profileLogin = params.get('login');
      this.getCollections.emit({ login: this.profileLogin, searchString: '', pageSize: this.pageSize, pageIndex: 0 });
    });
  }

  public searchCollections(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.getCollections.emit({ login: this.profileLogin, searchString: this.searchString, pageSize: this.pageSize, pageIndex: this.pageIndex });
    }, 700);
  }

  public clearSearch(): void {
    this.searchString = '';
    this.pageIndex = 0;
    this.getCollections.emit({ login: this.profileLogin, searchString: '', pageSize: this.pageSize, pageIndex: this.pageIndex });
  }

  public pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCollections.emit({ login: this.profileLogin, searchString: this.searchString, pageSize: event.pageSize, pageIndex: event.pageIndex });
  }
}
