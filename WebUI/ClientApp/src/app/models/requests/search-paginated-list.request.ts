import { PaginatedListRequest } from "./paginated-list.request";

export class SearchPaginatedListRequest extends PaginatedListRequest {
  public searchString: string;
}