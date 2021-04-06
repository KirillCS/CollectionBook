export class PaginatedListResponse<T> {
  public items: T[];
  public totalCount: number;
}