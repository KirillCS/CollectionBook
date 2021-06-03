import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { DashboardReportDto } from 'src/app/models/dtos/report/dashboard-report.dto';
import { PaginatedListRequest } from 'src/app/models/requests/paginated-list.request';
import { AdminService } from 'src/app/services/admin.service';
import { AuthTokenService, TokenSettingType } from 'src/app/services/auth-token.service';
import { AuthService } from 'src/app/services/auth.service';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';
import { FieldDialogComponent } from '../../dialogs/field-dialog/field-dialog.component';
import { PaginatedBaseComponent } from '../../search/paginated-base.component';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['../dashboard.component.scss', './reports-dashboard.component.scss'],
  animations: [
    trigger('reportDescription', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportsDashboardComponent extends PaginatedBaseComponent implements OnInit {
  private _displayedColumns = ['date', 'collection', 'user', 'decision'];

  private _from: Date = null;
  private _to: Date = null;

  private _reportsLoaded = false;
  private _reports = new Array<DashboardReportDto>();

  expandedReport: DashboardReportDto = null;

  public constructor(
    private _adminService: AdminService,
    private _dialogsService: DefaultDialogsService,
    private _dialog: MatDialog,
    private _router: Router,
    private _authService: AuthService,
    private _authTokenService: AuthTokenService
  ) {
    super();
    this._pageSize = 20;
  }

  public get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  public get reportsLoaded(): boolean {
    return this._reportsLoaded;
  }

  public get reports(): DashboardReportDto[] {
    return this._reports;
  }

  public ngOnInit(): void {
    this._updateReports();
  }

  public dateRangeChangedHandler(range: DateRange<Date>): void {
    this._from = range?.start;
    this._to = range?.end;
    this._pageIndex = 0;

    this._updateReports();
  }

  public acceptButtonClickedHandler(event: Event, report: DashboardReportDto): void {
    event.stopPropagation();
    let ref = this._dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '25vh' },
      data: {
        header: 'Collection deletion',
        message: `Are you sure you want to delete the collection "${report.collectionName}"? Enter a collection deletion reason and click the delete button.`,
        inputLabel: 'Reason',
        inputType: 'textarea',
        formControl: new FormControl('', Validators.required),
        inputErrors: [{ errorCode: 'required', errorMessage: 'Enter reason' }],
        closeButtonName: 'Cancel',
        submitButtonName: 'Delete'
      }
    });

    let submitSubscription = ref.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      ref.close();
      this._deleteCollection(report.collectionId, formControl.value);
    });

    ref.afterClosed().subscribe(() => submitSubscription.unsubscribe());
  }

  public refuseButtonClickedHandler(event: Event, report: DashboardReportDto): void {
    event.stopPropagation();
    this._deleteReport(report.id);
  }

  public pageChangedHandler(event: PageEvent): void {
    this._pageIndex = event.pageIndex;
    this._pageSize = event.pageSize;

    this._updateReports();
  }

  private _updateReports(): void {
    this._reportsLoaded = false;

    let request: PaginatedListRequest = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this._adminService.getDashboardReports(request, this._from, this._to).subscribe(
      list => {
        this._reports = list.items;
        this._totalCount = list.totalCount;
      },
      (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 401:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('Not authorized', 'You must be authorized to get dashboard reports.');
          case 403:
            let updatedToken = errorResponse.error.accessToken;
            let tokenSettingType = this._authTokenService.isConstant;
            if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
              this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
            }

            this._router.navigateByUrl('/');
            this._dialogsService.openWarningMessageDialog('No access', 'Your account role does not have access to report dashboard.');
            break;
          case 404:
            this._authService.logout(true);
            this._dialogsService.openWarningMessageDialog('User not found', 'Your account was not found. Try to log in again.');
            break;
          case 405:
            this._authService.logout(true);
            this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
            break;
          default:
            this._dialogsService.openWarningMessageDialog('Something went wrong', `Something went wrong on the server.`);
            break;
        }
      },
      () => this._reportsLoaded = true);
  }

  private _deleteCollection(id: number, reason: string): void {
    this._adminService.deleteCollection(id, reason).subscribe(
      () => this._updateReports(),
      (errorResponse: HttpErrorResponse) => this._handleDeletionErrors(errorResponse)
    );
  }

  private _deleteReport(id: number): void {
    this._adminService.deleteReport(id).subscribe(
      () => this._updateReports(),
      (errorResponse: HttpErrorResponse) => this._handleDeletionErrors(errorResponse)
    );
  }

  private _handleDeletionErrors(errorResponse: HttpErrorResponse): void {
    switch (errorResponse.status) {
      case 401:
        this._authService.logout(true);
        this._dialogsService.openWarningMessageDialog('Not authorized', 'You must be authorized to accept or refuse reports.');
      case 403:
        let updatedToken = errorResponse.error.accessToken;
        let tokenSettingType = this._authTokenService.isConstant;
        if (updatedToken && tokenSettingType !== TokenSettingType.NotSet) {
          this._authTokenService.setToken(updatedToken, tokenSettingType == TokenSettingType.Constant);
        }

        this._router.navigateByUrl('/');
        this._dialogsService.openWarningMessageDialog('No access', 'Your account role does not have access to accept or refuse reports.');
        break;
      case 404:
        this._authService.logout(true);
        this._dialogsService.openWarningMessageDialog('User not found', 'Your account was not found. Try to log in again.');
        break;
      case 405:
        this._authService.logout(true);
        this._dialogsService.openBlockReasonDialog(errorResponse.error.blockReason);
        break;
      default:
        this._dialogsService.openWarningMessageDialog('Something went wrong', `Something went wrong on the server.`);
        break;
    }
  }
}
