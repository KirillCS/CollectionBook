import { CollectionsSortCriterion } from "src/app/components/search/search-collections/collections-sort-criterion";
import { SearchCriterion } from "src/app/components/search/search-criterion";
import { SearchPaginatedListRequest } from "../search-paginated-list.request";

export class FindCollectionsRequest extends SearchPaginatedListRequest {
  public searchCriterion: SearchCriterion;
  public sortCriterion: CollectionsSortCriterion;
}