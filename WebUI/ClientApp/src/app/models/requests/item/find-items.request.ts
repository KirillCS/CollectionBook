import { SearchCriterion } from "src/app/components/search/search-criterion";
import { ItemsSortCriterion } from "src/app/components/search/search-items/items-sort-criterion";
import { SearchPaginatedListRequest } from "../search-paginated-list.request";

export class FindItemsRequest extends SearchPaginatedListRequest {
  public searchCriterion: SearchCriterion;
  public sortCriterion: ItemsSortCriterion;
}