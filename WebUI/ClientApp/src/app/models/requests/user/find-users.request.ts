import { UsersSortCriterion } from "src/app/components/search/search-users/users-sort-criterion";
import { SearchPaginatedListRequest } from "../search-paginated-list.request";

export class FindUsersRequest extends SearchPaginatedListRequest {
  public sortCriterion: UsersSortCriterion;
}