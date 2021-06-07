import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { SearchPaginatedListRequest } from 'src/app/models/requests/search-paginated-list.request';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { StarService } from 'src/app/services/star.service';
import { ProfileCoverSize } from '../../ui/profile-cover/profile-cover.component';

export class UsersListDialogData {
  private _collectionId: number;
  private _collectionName: string;

  constructor(collectionId: number, collectionName: string) {
    this._collectionId = collectionId;
    this._collectionName = collectionName ?? '';
  }

  public get collectionId(): number {
    return this._collectionId;
  }

  public get collectionName(): string {
    return this._collectionName;
  }
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list-dialog.component.html',
  styleUrls: ['./users-list-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListDialogComponent implements OnInit {

  private readonly _pageSize = 10;
  private _pageIndex = 0;
  private _searchString = '';

  private _usersLoaded = false;
  private _usersLoaded$ = new BehaviorSubject<boolean>(false);
  private _usersLoadedObservable = this._usersLoaded$.asObservable();
  private _users = new Array<UserCoverDto>();
  private _totalCount = 0;

  public constructor(
    @Inject(MAT_DIALOG_DATA) private _data: UsersListDialogData,
    private _starService: StarService,
    private _dialogRef: MatDialogRef<UsersListDialogComponent>,
    private _dialogsService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.loadMore();
  }

  public get collectionName() {
    return this._data.collectionName;
  }

  public get searchString(): string {
    return this._searchString;
  }

  public get usersLoadedObservable(): Observable<boolean> {
    return this._usersLoadedObservable;
  }

  private set usersLoaded(value: boolean) {
    this._usersLoaded = value;
    this._usersLoaded$.next(value);
  }

  public get users(): Array<UserCoverDto> {
    return this._users;
  }

  public get showNotFoundMessage(): boolean {
    return this._usersLoaded && this._totalCount == 0;
  }

  public get showLoadMore(): boolean {
    return this._usersLoaded && this._totalCount != this.users.length;
  }

  public get profileCoverSize() {
    return ProfileCoverSize.Small;
  }

  public findUsers(searchString: string): void {
    this._searchString = searchString;
    this._users = [];
    this._pageIndex = 0;

    this.loadMore();
  }

  public loadMore(): void {

    this.usersLoaded = false;
    let request: SearchPaginatedListRequest = {
      searchString: this._searchString,
      pageSize: this._pageSize,
      pageIndex: this._pageIndex
    };
    this._starService.getUsers(this._data.collectionId, request).subscribe(
      usersList => {
        this._users = [...this._users, ...usersList.items];
        this._totalCount = usersList.totalCount;
        this.usersLoaded = true;
        this._pageIndex++;
      },
      (errorResponse: HttpErrorResponse) => {
        this._dialogRef.close();
        if (errorResponse.status == 404) {
          this._dialogsService.openWarningMessageDialog('Коллекция не найдена', `Коллекция "${this._data.collectionName}" не найдена: возможно, ее удалил владелец.`);
          return;
        }
      });
  }
}
