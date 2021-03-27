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
    console.log(request);
    let formData = new FormData();
    formData.append('name', request.name);
    formData.append('description', request.description);
    request.tags.forEach(tag => {
      formData.append('tags', tag);
    })

    return this.httpClient.post<void>(`${this.apiUrl}api/collection/create`, formData);
  }
}
