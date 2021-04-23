import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL, DEFAULT_AVATAR, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { CollectionDto } from 'src/app/models/dtos/collection.dto';
import { FullCollectionDto } from 'src/app/models/dtos/full-collection.dto';
import { AuthService } from 'src/app/services/auth.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { DeleteFieldDialogComponent, DeleteFieldDialogData } from '../dialogs/delete-field-dialog/delete-field-dialog.component';
import { StarChangedEvent } from '../ui/star/star.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  private collectionId: number;
  private collectionDto: FullCollectionDto;

  public constructor(
    route: ActivatedRoute,
    private collectionService: CollectionService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DefaultDialogsService,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_AVATAR) private defaultAvatar: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaultCover: string
  ) {
    route.paramMap.subscribe(params => this.collectionId = parseInt(params.get("id")));
  }

  public get collection(): CollectionDto {
    return this.collectionDto?.collection;
  }

  public get collectionCover(): string {
    if (!this.collection?.coverPath) {
      return this.defaultCover;
    }

    return this.apiUrl + this.collection.coverPath;
  }

  public get starred(): boolean {
    return this.collection?.stars.some(s => s.userId === this.currentUserService.currentUser?.id)
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get showMenuButton(): boolean {
    return this.currentUserService.currentUser?.login == this.collection?.user?.login;
  }

  public ngOnInit(): void {
    this.getCollection();
  }

  public starStatusChanged(event: StarChangedEvent): void {
    if (event.newStatus && !this.starred) {
      this.collection.stars.push({ userId: this.currentUserService.currentUser?.id });
      return;
    }

    this.collection.stars = this.collection.stars.filter(s => s.userId == this.currentUserService.currentUser?.id);
  }

  public deleteButtonClicked(): void {
    let sub = this.dialog.open(DeleteFieldDialogComponent, {
      width: '500px',
      position: { top: '30vh' },
      data: {
        header: 'Are you sure?',
        message: `Are you sure you want to DELETE your collection "${this.collection.name}"? If you do this, the items of the collection will also be DELETED. This action cannot be undone. Please type your login to confirm.`,
        label: 'Your login',
        expectedString: this.collection.user.login,
        deleteButtonLabel: 'DELETE'
      }
    });

    sub.afterClosed().subscribe((agree: Boolean) => {
      if (agree) {
        this.deleteCollection();
      }
    })
  }

  private deleteCollection(): void {
    this.collectionService.delete(this.collection.id).subscribe(() => { }, (errorResponse: HttpErrorResponse) => {
      switch (errorResponse.status) {
        case 401:
          this.dialogService.openWarningMessageDialog('You are not authenticated', 'To delete the collection you must be authenticated.');
          break;
        case 403:
          this.dialogService.openWarningMessageDialog('You don\'t have access', `To delete the collection "${this.collection.name}" you must be its owner.`);
          break;
        default:
          this.dialogService.openWarningMessageDialog('Something went wrong', `Something went wrong while deleting the collection.`);
          break;
      }

    }, () => this.router.navigate(['/profile', this.collection.user.login, 'collections']));
  }

  private getCollection(): void {
    this.collectionService.getFullCollection(this.collectionId).subscribe(collection => this.collectionDto = collection)
  }
}
