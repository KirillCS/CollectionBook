import { PaginatedBaseComponent } from "./paginated-base.component";

export class SearchBaseComponent extends PaginatedBaseComponent {
  protected _searchString = '';

  public get searchString(): string {
    return this._searchString;
  }
}