import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';
import { CollectionCreatingRequest } from 'src/app/models/requests/collection/collection-creating.request';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public create(request: CollectionCreatingRequest): Observable<void> {
    let formData = new FormData();

    if (request.name) {
      formData.append('name', request.name);
    }

    if (request.description) {
      formData.append('description', request.description);
    }

    if (request.cover) {
      formData.append('cover', request.cover, request.cover.name);
    }

    request.tags.forEach(tag => {
      formData.append('tags', tag);
    })

    return this.httpClient.post<void>(`${this.apiUrl}api/collection/create`, formData);
  }

  public star(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/collection/star`, { id });
  }
}
