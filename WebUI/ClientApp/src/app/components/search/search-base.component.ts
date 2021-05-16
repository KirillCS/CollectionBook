export class SearchBaseComponent {
  protected _searchString = '';
    
  protected _totalCount = 0;
  protected _pageIndex = 0;
  protected _pageSize = 0;

  public get searchString(): string {
    return this._searchString;
  }
  
  public get totalCount(): number {
    return this._totalCount;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get pageSize(): number {
    return this._pageSize;
  }
}