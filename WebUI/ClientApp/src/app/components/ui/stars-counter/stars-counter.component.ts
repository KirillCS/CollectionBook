import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersListDialogComponent, UsersListDialogData } from '../../dialogs/users-list-dialog/users-list-dialog.component';

@Component({
  selector: 'app-stars-counter',
  templateUrl: './stars-counter.component.html',
  styleUrls: ['./stars-counter.component.scss']
})
export class StarsCounterComponent {

  private _count = 0;
  @Input() private collectionId: number;
  @Input() private collectionName: string;

  public constructor(private dialog: MatDialog, private router: Router) { }

  public get count(): number {
    return this._count
  }

  public openUsersList(): void {
    if (this.count <= 0) {
      return;
    }

    let dialogRef = this.dialog.open(UsersListDialogComponent, {
      width: '500px',
      data: new UsersListDialogData(this.collectionId, this.collectionName)
    });

    let sub = this.router.events.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  @Input('count')
  private set __count(value: number) {
    this._count = value < 0 ? 0 : value;
  }
}
