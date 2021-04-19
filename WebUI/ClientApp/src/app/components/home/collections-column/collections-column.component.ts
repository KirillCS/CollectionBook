import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CollectionNameDto } from 'src/app/models/dtos/collection-name.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collections-column',
  templateUrl: './collections-column.component.html',
  styleUrls: ['./collections-column.component.scss']
})
export class CollectionColumnComponent implements OnInit {

  private pageIndex = 0;
  private pageSize = 10;
  private searchString = '';
  private totalCount = 0;
  private notFound = false;

  public collections = new Array<CollectionNameDto>();

  public constructor(
    private currentUserService: CurrentUserService,
    private userService: UserService
  ) { }

  public ngOnInit(): void {
    this.addCollections();
  }

  public get collectionsNotFound(): boolean {
    return this.notFound;
  } 

  public get isButtonVisible(): boolean {
    return this.collections.length < this.totalCount;
  }

  public get total(): number {
    return this.totalCount;
  }
  
  public loadMore(): void {
    this.pageIndex++;
    this.addCollections();
  }

  public search(searchString: string): void {
    this.searchString = searchString;
    this.collections = new Array<CollectionNameDto>();
    this.pageIndex = 0;
    this.addCollections();
  }

  private addCollections(): void {
    this.userService.getCollectionsNames({
      login: this.currentUserService.currentUser?.login,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      searchString: this.searchString
    }).subscribe(response => {
      this.collections.push(...response.items);
      this.totalCount = response.totalCount;
    }, (errorResponse: HttpErrorResponse) => {}, () => this.notFound = this.collections.length == 0);
  }
}
