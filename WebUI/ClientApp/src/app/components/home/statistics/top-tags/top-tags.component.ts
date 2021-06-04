import { Component, Inject, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SEARCH_BY_KEY, SEARCH_STRING_KEY } from 'src/app/app-injection-tokens';
import { SearchCriteriaInStringFormat, SearchCriterion } from 'src/app/components/search/search-criterion';
import { TopTagDto } from 'src/app/models/dtos/tag/top-tag.dto';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-top-tags',
  templateUrl: './top-tags.component.html',
  styleUrls: ['./top-tags.component.css']
})
export class TopTagsComponent implements OnInit {

  private _tags$ = new Subject<TopTagDto[]>();
  private _tags = this._tags$.asObservable();
  private _tagsCount = 0;

  private _count = 10;
  private _availableCount = [5, 10, 20, 50, 100];

  private _tagsLoaded = false;

  public constructor(
    private _statisticsService: StatisticsService,
    @Inject(SEARCH_STRING_KEY) private _searchStringKey: string,
    @Inject(SEARCH_BY_KEY) private _searchByKey: string
  ) { }

  public ngOnInit(): void {
    this._updateTags();
  }

  public get tags(): Observable<TopTagDto[]> {
    return this._tags;
  }

  public get selectedCount(): number {
    return this._count
  }

  public set selectedCount(value: number) {
    this._count = value;
    this._tags$.next(new Array<TopTagDto>());
    this._updateTags();
  }

  public get availableCount(): number[] {
    return this._availableCount;
  }

  public get tagsLoaded(): boolean {
    return this._tagsLoaded;
  }

  public get noTags(): boolean {
    return this.tagsLoaded && this._tagsCount == 0;
  }

  public getTagQueryParams(tag: string): Params {
    return {
      [this._searchStringKey]: tag,
      [this._searchByKey]: SearchCriteriaInStringFormat.get(SearchCriterion.Tags)
    }
  }

  private _updateTags(): void {
    this._tagsLoaded = false;
    
    this._statisticsService.getTopTags(this.selectedCount).subscribe(list => {
      this._tags$.next(list);
      this._tagsCount = list.length;
      this._tagsLoaded = true;
    });
  }
}
