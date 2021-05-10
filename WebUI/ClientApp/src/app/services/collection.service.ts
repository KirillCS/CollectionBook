import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';
import { CollectionCreatingRequest } from 'src/app/models/requests/collection/collection-creating.request';
import { TagDto } from '../models/dtos/tag.dto';
import { SearchPaginatedListRequest } from '../models/requests/search-paginated-list.request';
import { ItemCoverDto } from '../models/dtos/item/item-cover.dto';
import { PaginatedListResponse } from '../models/responses/paginated-list.response';
import { CollectionDto } from '../models/dtos/collection/collection.dto';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public getCollection(id: number): Observable<CollectionDto> {
    return this.httpClient.get<CollectionDto>(`${this.apiUrl}api/collection/${id ?? ''}`);
  }

  public getItems(id: number, request: SearchPaginatedListRequest): Observable<PaginatedListResponse<ItemCoverDto>> {

    let params = new HttpParams({
      fromObject: {
        id: id.toString(),
        searchString: request.searchString,
        pageSize: request.pageSize.toString(),
        pageIndex: request.pageIndex.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<ItemCoverDto>>(`${this.apiUrl}api/collection/items`, { params });
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

    return this.httpClient.post<void>(`${this.apiUrl}api/collection`, formData);
  }

  public changeCover(id: number, newCover: File): Observable<string> {
    const formData = new FormData();
    formData.append('id', id.toString());

    if (newCover) {
      formData.append('cover', newCover, newCover.name);
    }

    return this.httpClient.put<string>(`${this.apiUrl}api/collection/cover`, formData, { responseType: 'text' as 'json' });
  }

  public changeName(id: number, newName: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/collection/name`, { id, newName });
  }

  public changeDescription(id: number, newDescription: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/collection/description`, { id, newDescription });
  }

  public changeTags(id: number, tags: string[]): Observable<TagDto[]> {
    tags ??= new Array<string>();
    return this.httpClient.put<TagDto[]>(`${this.apiUrl}api/collection/tags`, { id, tags });
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}api/collection/${id ?? ''}`);
  }

  public star(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}api/collection/star`, { id });
  }
}
