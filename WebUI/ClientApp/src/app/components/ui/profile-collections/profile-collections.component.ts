import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection.dto';

export class GetCollectionsData {
  public searchString: string;
  public pageSize: number;
  public pageIndex: number;
}

@Component({
  selector: 'app-profile-collections',
  templateUrl: './profile-collections.component.html',
  styleUrls: ['./profile-collections.component.css']
})
export class ProfileCollectionsComponent implements OnInit {

  private searchTimeout: any;

  @Output() public getCollections = new EventEmitter<GetCollectionsData>();

  @Input() public collections = new Observable<CollectionDto[]>();
  @Input() public totalCount = -1;

  public searchString = '';

  public pageSize = 12;
  public pageIndex = 0;

  public constructor() { }

  public ngOnInit(): void {
    this.getCollections.emit({ searchString: '', pageSize: this.pageSize, pageIndex: 0 });
  }

  public searchCollections(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.getCollections.emit({ searchString: this.searchString, pageSize: this.pageSize, pageIndex: this.pageIndex });
    }, 700);
  }

  public clearSearch(): void {
    this.searchString = '';
    this.pageIndex = 0;
    this.getCollections.emit({ searchString: '', pageSize: this.pageSize, pageIndex: this.pageIndex });
  }

  public pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCollections.emit({ searchString: this.searchString, pageSize: event.pageSize, pageIndex: event.pageIndex });
  }
}
