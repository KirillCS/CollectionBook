import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public searchTags(searchString: string, count: number): Observable<string[]> {
    let params = new HttpParams()
      .set('searchString', searchString)
      .set('count', count.toString());

    return this.httpClient.get<string[]>(`${this.apiUrl}api/tag/search`, { params });
  }
}
