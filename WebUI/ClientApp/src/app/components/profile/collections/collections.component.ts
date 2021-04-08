import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { UserCollectionDto } from 'src/app/models/dtos/user-collections.dto';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  private currentUserLogin = '';
  private collections$ = new Subject<UserCollectionDto[]>();

  private searchTimeout: any;

  public collections = this.collections$.asObservable();
  public totalCount = -1;

  public searchString = '';

  public pageSize = 12;
  public pageIndex = 0;

  public constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogsService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => {
      this.currentUserLogin = params.get('login');
      this.getCollections('', this.pageSize, 0);
    });
  }

  public searchCollections(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.getCollections(this.searchString, this.pageSize, this.pageIndex);
    }, 700);
  }

  public clearSearch(): void {
    this.searchString = '';
    this.pageIndex = 0;
    this.getCollections('', this.pageSize, this.pageIndex);
  }

  public pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCollections(this.searchString, event.pageSize, event.pageIndex);
  }

  private getCollections(searchString: string, pageSize: number, pageIndex: number): void {
    this.userService.getCollections({ login: this.currentUserLogin, searchString, pageSize, pageIndex }).subscribe(response => {
      this.totalCount = response.totalCount;
      this.collections$.next(response.items);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 400) {
        this.pageIndex = 0;
        this.pageSize = 0;

        return;
      }

      if (errorResponse.status == 404) {
        this.router.navigateByUrl('**', { skipLocationChange: true });

        return;
      }

      this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching for user collections.');
    });
  }
}
