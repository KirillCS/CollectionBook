import { Component, Inject, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

import { SEARCH_BY_KEY, SEARCH_STRING_KEY, SORT_BY_KEY } from 'src/app/app-injection-tokens';
import { ItemCoverDto } from 'src/app/models/dtos/item/item-cover.dto';
import { SelectValue } from 'src/app/models/ui/select-value';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { ItemService } from 'src/app/services/item.service';
import { SearchBaseComponent } from '../search-base.component';
import { SearchCriterion, SearchCriteriaSelectValues, SearchCriteriaInStringFormat } from '../search-criterion';
import { ItemsSortCriteriaInStringFormat, ItemsSortCriteriaSelectValues, ItemsSortCriterion } from './items-sort-criterion';

@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.component.html',
  styleUrls: ['../search.component.css']
})
export class SearchItemsComponent extends SearchBaseComponent implements OnDestroy {
  private queryParamsSub: Subscription;

  private readonly _searchCriterions = SearchCriteriaSelectValues;
  private _selectedSearchCriterion = SearchCriterion.Name;

  private readonly _sortCriterions = ItemsSortCriteriaSelectValues;
  private _selectedSortCriterion = ItemsSortCriterion.ByPopularity;

  private _itemsLoaded = false;

  private $items = new Subject<ItemCoverDto[]>();
  private _items = this.$items.asObservable();

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private searchByKey: string,
    @Inject(SORT_BY_KEY) private sortByKey: string,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private dialogService: DefaultDialogsService
  ) {
    super();
    this._pageSize = 20;
    this.queryParamsSub = route.queryParamMap.subscribe(params => this.handleQueryParamsChanging(params));
  }

  public ngOnDestroy(): void {
    this.queryParamsSub.unsubscribe();
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

  public get sortCriterions(): SelectValue<ItemsSortCriterion>[] {
    return this._sortCriterions;
  }

  public get selectedSortCriterion(): ItemsSortCriterion {
    return this._selectedSortCriterion;
  }

  public set selectedSortCriterion(value: ItemsSortCriterion) {
    if (!Object.values(ItemsSortCriterion).includes(value)) {
      value = ItemsSortCriterion.ByPopularity;
    }

    this._selectedSortCriterion = value;
    this.updateQueryParams();
  }

  public get itemsLoaded(): boolean {
    return this._itemsLoaded;
  }

  public get items(): Observable<ItemCoverDto[]> {
    return this._items;
  }

  public pageChanged(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;
    this.getItems();
  }

  private handleQueryParamsChanging(params: ParamMap): void {
    this._searchString = params.get(this.searchStringKey) ?? '';

    SearchCriteriaInStringFormat.forEach((v, k) => {
      if (v === params.get(this.searchByKey)) {
        this._selectedSearchCriterion = k;
        return;
      }
    });

    ItemsSortCriteriaInStringFormat.forEach((v, k) => {
      if (v === params.get(this.sortByKey)) {
        this._selectedSortCriterion = k;
        return;
      }
    });

    this.getItems();
  }

  private getItems(): void {
    this._itemsLoaded = false;
    this.itemService.find({
      searchString: this.searchString,
      searchCriterion: this.selectedSearchCriterion,
      sortCriterion: this.selectedSortCriterion,
      pageIndex: this._pageIndex,
      pageSize: this._pageSize
    }).subscribe(
      list => {
        this.$items.next(list.items);
        this._totalCount = list.totalCount;
      },
      () => {
        this.dialogService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching items.');
        this._itemsLoaded = true;
      },
      () => this._itemsLoaded = true);
  }

  private updateQueryParams(): void {
    let queryParams: Params = {
      [this.searchStringKey]: this.searchString,
      [this.searchByKey]: SearchCriteriaInStringFormat.get(this.selectedSearchCriterion),
      [this.sortByKey]: ItemsSortCriteriaInStringFormat.get(this.selectedSortCriterion),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
