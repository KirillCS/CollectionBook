import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CollectionNameDto } from 'src/app/models/dtos/collection/collection-name.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collections-column',
  templateUrl: './collections-column.component.html',
  styleUrls: ['./collections-column.component.scss']
})
export class CollectionColumnComponent implements OnInit {

  private _collectionsLoading: boolean;
  private pageIndex = 0;
  private pageSize = 10;
  private searchString = '';
  private totalCount = 0;
  private notFound = false;

  public collections = new Array<CollectionNameDto>();

  public constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private dialogService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.updateCollections();
  }

  public get collectionsLoading(): boolean {
    return this._collectionsLoading;
  }

  public get collectionsNotFound(): boolean {
    return this.notFound;
  }

  public get isButtonVisible(): boolean {
    return this.collections.length < this.totalCount;
  }

  public get total(): number {
    return this.totalCount;
  }

  public loadMore(): void {
    if (this.collectionsLoading) {
      return;
    }

    this.pageIndex++;
    this.updateCollections();
  }

  public search(searchString: string): void {
    this.searchString = searchString;
    this.collections = new Array<CollectionNameDto>();
    this.pageIndex = 0;
    this.updateCollections();
  }

  private updateCollections(): void {

    this._collectionsLoading = true;
    let request: SearchPaginatedListRequest = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchString: this.searchString
    }
    this.userService.getCollectionsNames(this.currentUserService.currentUser?.login, request).subscribe(
      response => {
        this.collections.push(...response.items);
        this.totalCount = response.totalCount;
      },
      (errorResponse: HttpErrorResponse) => {
        this.notFound = this.collections.length == 0;
        this._collectionsLoading = false;
        if (errorResponse.status == 404) {
          this.dialogService.openWarningMessageDialog('Ошибка получения коллекций', 'В процессе выборки коллекций произошла ошибка: пользователь не найден.');
          return;
        }

        this.dialogService.openWarningMessageDialog('Ошибка получения коллекций', 'В процессе выборки коллекций произошла неизвестная ошибка.');
      },
      () => {
        this.notFound = this.collections.length == 0;
        this._collectionsLoading = false;
      });
  }
}
