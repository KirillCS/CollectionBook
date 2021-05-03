import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public create(name: string, collectionId: number): Observable<number> {
    return this.httpClient.post<number>(`${this.apiUrl}api/item`, { name, collectionId });
  }
}
