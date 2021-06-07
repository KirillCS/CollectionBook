import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';
import { GetCollectionsData } from '../../ui/profile-collections/profile-collections.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html'
})
export class CollectionsComponent {

  private collections$ = new Subject<CollectionDto[]>();
  private _collectionsLoaded = false;

  public collections = this.collections$.asObservable();
  public totalCount = -1;

  public constructor(
    private userService: UserService,
    private router: Router,
    private dialogsService: DefaultDialogsService
  ) { }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public getCollections(data: GetCollectionsData): void {
    this._collectionsLoaded = false;
    let request: SearchPaginatedListRequest = {
      pageIndex: data.pageIndex,
      pageSize: data.pageSize,
      searchString: data.searchString
    };
    this.userService.getCollections(data.login, request).subscribe(
      list => {
        this.totalCount = list.totalCount;
        this.collections$.next(list.items);
      },
      (errorResponse: HttpErrorResponse) => {
        this._collectionsLoaded = true;
        if (errorResponse.status == 404) {
          this.router.navigateByUrl('**', { skipLocationChange: true });
          return;
        }
      },
      () => this._collectionsLoaded = true);
  }
}
