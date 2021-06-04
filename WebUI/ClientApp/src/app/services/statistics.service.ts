import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';
import { TopCollectionDto } from '../models/dtos/collection/top-collection.dto';
import { TopTagDto } from '../models/dtos/tag/top-tag.dto';
import { CountsResponse } from '../models/responses/statistics/counts.response';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getCounts(): Observable<CountsResponse> {
    return this.httpClient.get<CountsResponse>(`${this.apiUrl}api/stat/counts`);
  }

  public getTopTags(count: number): Observable<TopTagDto[]> {
    let params = new HttpParams().set('count', count.toString());

    return this.httpClient.get<TopTagDto[]>(`${this.apiUrl}api/stat/top/tags`, { params });
  }

  public getTopCollections(count: number): Observable<TopCollectionDto[]> {
    let params = new HttpParams().set('count', count.toString());

    return this.httpClient.get<TopCollectionDto[]>(`${this.apiUrl}api/stat/top/collections`, { params });
  }
}
