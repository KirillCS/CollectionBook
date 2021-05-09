import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { CollectionNameDto } from 'src/app/models/dtos/collection/collection-name.dto';
import { ItemCoverDto } from 'src/app/models/dtos/item/item-cover.dto';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collection-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  private readonly _pageSizeOptions: number[] = [10, 20, 30];
  private searchString = '';
  private _pageSize = 10;
  private _pageIndex = 0;
  private _totalCount: number;

  private _itemsLoaded: boolean;
  private readonly _items = new Array<ItemCoverDto>();

  @Input() private collectionId: number;

  public constructor(
    private collectionService: CollectionService
  ) { }

  public ngOnInit(): void {
    this.getItems();
  }

  public get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get totalCount(): number {
    return this._totalCount;
  }

  public get itemsLoaded(): boolean {
    return this._itemsLoaded;
  }

  public get items(): Array<ItemCoverDto> {
    return this._items;
  }

  public searchInputChanged(searchString: string): void {
    this.searchString = searchString;
    this.getItems();
  }

  public pageChanged(event: PageEvent): void {
    this._pageSize = event.pageSize;
    this._pageIndex = event.pageIndex;
    this.getItems();
  }

  private getItems(): void {
    this._itemsLoaded = false;
    this.collectionService.getItems(
      this.collectionId,
      {
        searchString: this.searchString,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }).subscribe(list => {
        this._totalCount = list.totalCount;

        this.items.length = 0;
        this.items.push(...list.items);
      }, (errorResponse: HttpErrorResponse) => {

      }, () => this._itemsLoaded = true);
  }
}
