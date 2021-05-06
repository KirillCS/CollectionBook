import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection/collection.dto';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';
import { GetCollectionsData } from '../../ui/profile-collections/profile-collections.component';
import { StarChangedEvent } from '../../ui/star/star.component';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html'
})
export class StarsComponent implements OnInit {

  private currentUserLogin = '';
  private profileUserLogin = '';

  private collections = new Array<CollectionDto>();

  private collections$ = new Subject<CollectionDto[]>();
  public observableCollections = this.collections$.asObservable();

  public totalCount = -1;

  public constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private dialogsService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.route.parent.paramMap.subscribe(params => this.profileUserLogin = params.get('login'));
    this.currentUserLogin = this.currentUserService.currentUser?.login;
    this.observableCollections.subscribe(collections => this.collections = collections);
  }

  public getCollections(data: GetCollectionsData): void {
    this.userService.getStarredCollections(data.login, { pageIndex: data.pageIndex, pageSize: data.pageSize, searchString: data.searchString }).subscribe(response => {
      this.totalCount = response.totalCount;
      this.collections$.next(response.items);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 400) {
        this.collections$.next(new Array<CollectionDto>());

        return;
      }

      if (errorResponse.status == 404) {
        this.router.navigateByUrl('**', { skipLocationChange: true });

        return;
      }

      this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server while searching for user collections.');
    });
  }

  public collectionStarChanged(event: StarChangedEvent): void {
    if (this.currentUserLogin !== this.profileUserLogin) {
      return;
    }

    this.collections$.next(this.collections.filter(c => c.id !== event.collectionId));
    this.totalCount--;
  }
}
