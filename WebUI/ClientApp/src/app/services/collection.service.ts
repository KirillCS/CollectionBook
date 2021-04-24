import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';
import { CollectionCreatingRequest } from 'src/app/models/requests/collection/collection-creating.request';
import { FullCollectionDto } from 'src/app/models/dtos/full-collection.dto';
import { TagDto } from '../models/dtos/tag.dto';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getFullCollection(id: number): Observable<FullCollectionDto> {
    return this.httpClient.get<FullCollectionDto>(`${this.apiUrl}api/collection/${id ?? ''}`);
  }

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

  public changeCover(id: number, newCover: File): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    if (newCover) {
      formData.append('cover', newCover, newCover.name);
    }

    return this.httpClient.post<string>(`${this.apiUrl}api/collection/change/cover`, formData, { responseType: 'text' as 'json' });
  }

  public changeName(id: number, newName: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/collection/change/name`, { id, newName });
  }

  public changeDescription(id: number, newDescription: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/collection/change/description`, { id, newDescription });
  }

  public changeTags(id: number, tags: string[]): Observable<TagDto[]> {
    tags ??= new Array<string>();
    return this.httpClient.post<TagDto[]>(`${this.apiUrl}api/collection/change/tags`, { id, tags });
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}api/collection/${id ?? ''}`);
  }

  public star(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/collection/star`, { id });
  }
}
