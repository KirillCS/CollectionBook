import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { GetProfileCollectionsRequest } from 'src/app/models/requests/user/get-profile-collections.request';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html'
})
export class CollectionsComponent {
  
  private collections$ = new Subject<CollectionDto[]>();

  public collections = this.collections$.asObservable();
  public totalCount = -1;

  public constructor(
    private userService: UserService,
    private router: Router,
    private dialogsService: DefaultDialogsService
  ) { }

  public getCollections(data: GetProfileCollectionsRequest): void {
    this.userService.getCollections(data).subscribe(response => {
      this.totalCount = response.totalCount;
      this.collections$.next(response.items);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status == 400) {
        this.collections$.next(new CollectionDto[0]);
        
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
