import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, Inject, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

import { SEARCH_BY_KEY, SEARCH_STRING_KEY, SORT_BY_KEY } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { SelectValue } from 'src/app/models/ui/select-value';
import { CollectionService } from 'src/app/services/collection.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { SearchCriterion, SearchCriteriaSelectValues, SearchCriteriaInStringFormat } from '../search-criterion';
import { CollectionsSortCriteriaInStringFormat, CollectionsSortCriteriaSelectValues, CollectionsSortCriterion } from './collections-sort-criterion';

@Component({
  selector: 'app-search-collections',
  templateUrl: './search-collections.component.html',
  styleUrls: ['./search-collections.component.css']
})
export class SearchCollectionsComponent implements OnDestroy {

  private queryParamsSub: Subscription;

  private _searchString: string;

  private readonly _searchCriterions = SearchCriteriaSelectValues;
  private _selectedSearchCriterion = SearchCriterion.Name;

  private readonly _sortCriterions = CollectionsSortCriteriaSelectValues;
  private _selectedSortCriterion = CollectionsSortCriterion.ByPopularity;

  private _collectionsLoaded = false;

  private $collections = new Subject<CollectionDto[]>();
  private _collections = this.$collections.asObservable();
  private _totalCount: number;

  private _pageIndex = 0;
  private _pageSize = 24;

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string,
    @Inject(SORT_BY_KEY) private sortByKey: string,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private dialogService: DefaultDialogsService
  ) {
    this.queryParamsSub = route.queryParamMap.subscribe(params => this.handleQueryParamsChanging(params));
  }

  public ngOnDestroy(): void {
    this.queryParamsSub.unsubscribe();
  }

  public get searchString(): string {
    return this._searchString;
  }

  public get searchCriterions(): SelectValue<SearchCriterion>[] {
    return this._searchCriterions;
  }

  public get selectedSearchCriterion(): SearchCriterion {
    return this._selectedSearchCriterion;
  }

  public set selectedSearchCriterion(value: SearchCriterion) {
    if (!Object.values(SearchCriterion).includes(value)) {
      value = SearchCriterion.Name;
    }

    this._selectedSearchCriterion = value;
    this.updateQueryParams();
  }

  public get sortCriterions(): SelectValue<CollectionsSortCriterion>[] {
    return this._sortCriterions;
  }

  public get selectedSortCriterion(): CollectionsSortCriterion {
    return this._selectedSortCriterion;
  }

  public set selectedSortCriterion(value: CollectionsSortCriterion) {
    if (!Object.values(CollectionsSortCriterion).includes(value)) {
      value = CollectionsSortCriterion.ByPopularity;
    }

    this._selectedSortCriterion = value;
    this.updateQueryParams();
  }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public get collections(): Observable<CollectionDto[]> {
    return this._collections;
  }

  public get totalCount(): number {
    return this._totalCount;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public pageChanged(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;
    this.getCollections();
  }

  private handleQueryParamsChanging(params: ParamMap): void {
    this._searchString = params.get(this.searchStringKey) ?? '';

    SearchCriteriaInStringFormat.forEach((v, k) => {
      if (v === params.get(this.searchByKey)) {
        this._selectedSearchCriterion = k;
        return;
      }
    });

    CollectionsSortCriteriaInStringFormat.forEach((v, k) => {
      if (v === params.get(this.sortByKey)) {
        this._selectedSortCriterion = k;
        return;
      }
    });

    this.getCollections();
  }

  private getCollections(): void {
    this._collectionsLoaded = false;
    this.collectionService.findCollections({
      searchString: this.searchString,
      searchCriterion: this.selectedSearchCriterion,
      sortCriterion: this.selectedSortCriterion,
      pageIndex: this._pageIndex,
      pageSize: this._pageSize
    }).subscribe(list => {
      this.$collections.next(list.items);
      this._totalCount = list.totalCount;
    }, () => {
      this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching collections.');
      this._collectionsLoaded = true;
    }, () => this._collectionsLoaded = true);
  }

  private updateQueryParams(): void {
    let queryParams: Params = {
      [this.searchStringKey]: this.searchString,
      [this.searchByKey]: SearchCriteriaInStringFormat.get(this.selectedSearchCriterion),
      [this.sortByKey]: CollectionsSortCriteriaInStringFormat.get(this.selectedSortCriterion),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
