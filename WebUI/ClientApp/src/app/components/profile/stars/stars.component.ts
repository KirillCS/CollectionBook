import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { GetProfileCollectionsRequest } from 'src/app/models/requests/user/get-profile-collections.request';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';
import { StarChangedEvent } from '../../ui/star/star.component';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html'
})
export class StarsComponent implements OnInit {

  private collections = new Array<CollectionDto>();

  private collections$ = new Subject<CollectionDto[]>();
  public observableCollections = this.collections$.asObservable();

  public totalCount = -1;

  public constructor(
    private userService: UserService,
    private router: Router,
    private dialogsService: DefaultDialogsService
  ) { }

  public ngOnInit(): void {
    this.observableCollections.subscribe(collections => this.collections = collections);
  }

  public getCollections(data: GetProfileCollectionsRequest): void {
    this.userService.getStarredCollections(data).subscribe(response => {
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
    this.collections$.next(this.collections.filter(c => c.id !== event.collectionId));
    this.totalCount--;
  }
}
