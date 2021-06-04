import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

import { CountsResponse } from 'src/app/models/responses/statistics/counts.response';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.css']
})
export class CountsComponent implements OnInit {

  private _data = new Array<CountsResponse>();
  private _displayingColumns = ['users', 'blockedUsers', 'collections', 'items'];

  @ViewChild(MatTable) private _table: MatTable<CountsResponse>;

  public constructor(private _statisticsService: StatisticsService) { }

  public ngOnInit(): void {
      let sub = this._statisticsService.getCounts().subscribe(counts => {
        this._data.push(counts);
        this._table.renderRows();
        sub.unsubscribe();
      });
  }

  public get data(): CountsResponse[] {
    return this._data;
  }

  public get displayingColumns(): string[] {
    return this._displayingColumns;
  }
}
