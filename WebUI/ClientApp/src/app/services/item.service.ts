import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../app-injection-tokens';
import { ImageDto } from '../models/dtos/image.dto';
import { ItemCoverDto } from '../models/dtos/item/item-cover.dto';
import { ItemDto } from '../models/dtos/item/item.dto';
import { TagDto } from '../models/dtos/tag.dto';
import { FindItemsRequest } from '../models/requests/item/find-items.request';
import { PaginatedListResponse } from '../models/responses/paginated-list.response';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  public constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public get(id: number): Observable<ItemDto> {
    return this.httpClient.get<ItemDto>(`${this.apiUrl}api/item/${id}`);
  }

  public find(request: FindItemsRequest): Observable<PaginatedListResponse<ItemCoverDto>> {
    let params = new HttpParams({
      fromObject: {
        searchString: request.searchString,
        searchCriterion: request.searchCriterion.toString(),
        sortCriterion: request.sortCriterion.toString(),
        pageIndex: request.pageIndex.toString(),
        pageSize: request.pageSize.toString()
      }
    });

    return this.httpClient.get<PaginatedListResponse<ItemCoverDto>>(`${this.apiUrl}api/item`, { params });
  }

  public create(name: string, collectionId: number): Observable<number> {
    return this.httpClient.post<number>(`${this.apiUrl}api/item`, { name, collectionId });
  }

  public addImage(id: number, image: File): Observable<ImageDto> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('image', image, image.name);

    return this.httpClient.post<ImageDto>(`${this.apiUrl}api/item/image`, formData);
  }

  public removeImage(imageId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}api/item/image/${imageId}`);
  }

  public changeName(id: number, newName: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/item/name`, { id, newName });
  }

  public changeInfo(id: number, newInfo: string): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}api/item/info`, { id, newInfo });
  }

  public changeTags(id: number, tags: string[]): Observable<TagDto[]> {
    return this.httpClient.put<TagDto[]>(`${this.apiUrl}api/item/tags`, { id, tags });
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}api/item/${id}`);
  }
}
