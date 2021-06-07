import { Component, Inject, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { SEARCH_BY_KEY, SEARCH_STRING_KEY, SORT_BY_KEY } from 'src/app/app-injection-tokens';
import { UserCardDto } from 'src/app/models/dtos/user/user-card.dto';
import { SelectValue } from 'src/app/models/ui/select-value';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';
import { SearchBaseComponent } from '../search-base.component';
import { UsersSortCriteriaInStringFormat, UsersSortCriteriaSelectValues, UsersSortCriterion } from './users-sort-criterion';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['../search.component.css']
})
export class SearchUsersComponent extends SearchBaseComponent implements OnDestroy {
  private queryParamsSub: Subscription;

  private readonly _sortCriterions = UsersSortCriteriaSelectValues;
  private _selectedSortCriterion = UsersSortCriterion.ByAlphabetUp;

  private _usersLoaded = false;

  private $users = new Subject<UserCardDto[]>();
  private _users = this.$users.asObservable();

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string,
    @Inject(SORT_BY_KEY) private sortByKey: string,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    super();
    this._pageSize = 20;
    this.queryParamsSub = route.queryParamMap.subscribe(params => this.handleQueryParamsChanging(params));
  }

  public ngOnDestroy(): void {
    this.queryParamsSub.unsubscribe();
  }

  public get sortCriterions(): SelectValue<UsersSortCriterion>[] {
    return this._sortCriterions;
  }

  public get selectedSortCriterion(): UsersSortCriterion {
    return this._selectedSortCriterion;
  }

  public set selectedSortCriterion(value: UsersSortCriterion) {
    if (!Object.values(UsersSortCriterion).includes(value)) {
      value = UsersSortCriterion.ByAlphabetUp;
    }

    this._selectedSortCriterion = value;
    this.updateQueryParams();
  }

  public get usersLoaded(): boolean {
    return this._usersLoaded;
  }

  public get users(): Observable<UserCardDto[]> {
    return this._users;
  }

  public pageChanged(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;
    this.getUsers();
  }

  private handleQueryParamsChanging(params: ParamMap): void {
    this._searchString = params.get(this.searchStringKey) ?? '';

    UsersSortCriteriaInStringFormat.forEach((v, k) => {
      if (v === params.get(this.sortByKey)) {
        this._selectedSortCriterion = k;
        return;
      }
    });

    this.getUsers();
  }

  private getUsers(): void {
    this._usersLoaded = false;
    this.userService.find({
      searchString: this.searchString,
      sortCriterion: this.selectedSortCriterion,
      pageIndex: this._pageIndex,
      pageSize: this._pageSize
    }).subscribe(
      list => {
        this.$users.next(list.items);
        this._totalCount = list.totalCount;
        this._usersLoaded = true;
      });
  }

  private updateQueryParams(): void {
    let queryParams: Params = {
      [this.searchStringKey]: this.searchString,
      [this.sortByKey]: UsersSortCriteriaInStringFormat.get(this.selectedSortCriterion)
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
