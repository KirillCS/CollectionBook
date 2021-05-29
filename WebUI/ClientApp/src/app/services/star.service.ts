import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class StarService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public toggle(collectionId: number):  Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/star`, { collectionId });
  }
}
