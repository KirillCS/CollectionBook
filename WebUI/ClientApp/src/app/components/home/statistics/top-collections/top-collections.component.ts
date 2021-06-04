import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { TopCollectionDto } from 'src/app/models/dtos/collection/top-collection.dto';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-top-collections',
  templateUrl: './top-collections.component.html',
  styleUrls: ['./top-collections.component.css']
})
export class TopCollectionsComponent implements OnInit {

  private _count = 10;
  private _availableCount = [5, 10, 20, 40];

  private _collections$ = new Subject<TopCollectionDto[]>();
  private _collections = this._collections$.asObservable();
  private _collectionsLoaded = false;

  private _displayingColumns = ['name', 'owner', 'starsCount'];

  public constructor(private _statisticsService: StatisticsService) { }

  public ngOnInit(): void {
    this._updateCollections();
  }

  public set selectedCount(value: number) {
    this._count = value;
    this._updateCollections();
  }

  public get availableCount(): number[] {
    return this._availableCount;
  }

  public get collections(): Observable<TopCollectionDto[]> {
    return this._collections;
  }

  public get selectedCount(): number {
    return this._count
  }

  public get collectionsLoaded(): boolean {
    return this._collectionsLoaded;
  }

  public get displayingColumns(): string[] {
    return this._displayingColumns;
  }

  private _updateCollections(): void {
    this._collectionsLoaded = false;
    
    this._statisticsService.getTopCollections(this.selectedCount).subscribe(list => {
      this._collections$.next(list);
      this._collectionsLoaded = true;
    });
  }
}
