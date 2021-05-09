import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { ItemCoverDto } from 'src/app/models/dtos/item/item-cover.dto';
import { CollectionService } from 'src/app/services/collection.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

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
  @Input('showAddButton') private _showAddButton: boolean;

  @Output('addButtonWasClicked') private _addButtonWasClicked = new EventEmitter();

  public constructor(
    private collectionService: CollectionService,
    private router: Router,
    private dialogService: DefaultDialogsService
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

  public get showAddButton(): boolean {
    return this._showAddButton;
  }

  public addButtonWasClicked(): void {
    this._addButtonWasClicked.emit();
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
        if (errorResponse.status === 404) {
          this.router.navigateByUrl('**', { skipLocationChange: true });
        } else {
          this._itemsLoaded = true;
          this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server. Try to reload the page to solve this problem.');
        }
      }, () => this._itemsLoaded = true);
  }
}
