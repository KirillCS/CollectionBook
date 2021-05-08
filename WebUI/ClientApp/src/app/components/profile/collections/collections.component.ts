import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
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
    this.userService.getCollections(data.login, { pageIndex: data.pageIndex, pageSize: data.pageSize, searchString: data.searchString }).subscribe(response => {
      this.totalCount = response.totalCount;
      this.collections$.next(response.items);
    }, (errorResponse: HttpErrorResponse) => {
      this._collectionsLoaded = true;
      if (errorResponse.status == 400) {
        this.collections$.next(new CollectionDto[0]);

        return;
      }

      if (errorResponse.status == 404) {
        this.router.navigateByUrl('**', { skipLocationChange: true });

        return;
      }

      this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching for user collections.');
    }, () => this._collectionsLoaded = true);
  }
}
