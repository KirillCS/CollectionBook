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

  public changeName(id: number, newName: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/item/name`, { id, newName });
  }

  public changeInfo(id: number, newInfo: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/item/info`, { id, newInfo });
  }

  public changeTags(id: number, tags: string[]): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/item/tags`, { id, tags });
  }
}
