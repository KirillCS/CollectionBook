import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';
import { GetCollectionsData } from '../../ui/profile-collections/profile-collections.component';
import { StarToggledEventArgs } from '../../ui/star/star.component';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html'
})
export class StarsComponent implements OnInit {

  private currentUserLogin = '';
  private profileUserLogin = '';

  private collections = new Array<CollectionDto>();
  private _collectionsLoaded = false;

  private collections$ = new Subject<CollectionDto[]>();
  public observableCollections = this.collections$.asObservable();

  public totalCount = -1;

  public constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private dialogsService: DefaultDialogsService
  ) { }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => this.profileUserLogin = params.get('login'));
    this.currentUserLogin = this.currentUserService.currentUser?.login;
    this.observableCollections.subscribe(collections => this.collections = collections);
  }

  public getCollections(data: GetCollectionsData): void {
    this._collectionsLoaded = false;
    let request: SearchPaginatedListRequest = {
      pageIndex: data.pageIndex,
      pageSize: data.pageSize,
      searchString: data.searchString
    };
    this.userService.getStarredCollections(data.login, request).subscribe(
      response => {
        this.totalCount = response.totalCount;
        this.collections$.next(response.items);
      },
      (errorResponse: HttpErrorResponse) => {
        this._collectionsLoaded = true;
        if (errorResponse.status == 404) {
          this.router.navigateByUrl('**', { skipLocationChange: true });
          return;
        }

        this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching for user collections.');
      },
      () => this._collectionsLoaded = true);
  }

  public collectionStarToggledHandler(event: StarToggledEventArgs): void {
    console.log(event);
    if (this.currentUserLogin !== this.profileUserLogin) {
      return;
    }

    this.collections$.next(this.collections.filter(c => c.id !== event.collectionId));
    this.totalCount--;
  }
}
