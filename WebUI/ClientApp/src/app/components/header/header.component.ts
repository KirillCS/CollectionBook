import { Component, Inject } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { UserLoginDto } from 'src/app/models/dtos/user/user-login.dto';
import { Params, PRIMARY_OUTLET, Router } from '@angular/router';
import { SEARCH_STRING_KEY } from 'src/app/app-injection-tokens';
import { Roles } from 'src/app/models/roles';
import { MatDialog } from '@angular/material/dialog';
import { FieldDialogComponent } from '../dialogs/field-dialog/field-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { AuthTokenService } from 'src/app/services/auth-token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultDialogsService } from 'src/app/services/default-dialogs.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public constructor(
    @Inject(SEARCH_STRING_KEY) private searchStringKey: string,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private authTokenService: AuthTokenService,
    private dialogsService: DefaultDialogsService
  ) { }
  
  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public get currentUser(): UserLoginDto {
    return this.currentUserService.currentUser;
  }

  public get ownerRole(): string {
    return Roles.Owner;
  }

  public get adminRole(): string {
    return Roles.Admin;
  }

  public searchInputChanged(input: HTMLInputElement): void {
    let queryParams: Params = {
      [this.searchStringKey]: input.value
    };

    let urlTree = this.router.parseUrl(this.router.url);
    let urlGroup = urlTree.root.children[PRIMARY_OUTLET];
    let url = '/search/collections';
    if (urlGroup && urlGroup.segments[0].path === 'search') {
      url = `/${urlGroup.segments.join('/')}`;
    }
    
    this.router.navigate([url], { queryParams, queryParamsHandling: 'merge' });
    input.value = '';
  }

  public changeLogin(): void {
    let dialogRef = this.dialog.open(FieldDialogComponent, {
      width: '550px',
      position: { top: '30vh' },
      data: {
        header: 'Changing owner login',
        message: `Current login: "${this.currentUser.login}". Enter new login and click the change button.`,
        inputLabel: 'New login',
        inputType: 'text',
        formControl: new FormControl('', [Validators.required, Validators.maxLength(256), Validators.pattern('^[a-zA-Z0-9-_.]+$')]),
        inputErrors: [
          { errorCode: 'required', errorMessage: 'Enter new login' },
          { errorCode: 'maxlength', errorMessage: 'Login must be no more than 256 characters long' },
          { errorCode: 'pattern', errorMessage: 'Login can only contain english letters, numbers and symbols (_ - .)' },
          { errorCode: 'using', errorMessage: 'Login is already in use' },
          { errorCode: 'exists', errorMessage: 'This login already exists' }
        ],
        closeButtonName: 'Cancel',
        submitButtonName: 'Change'
      }
    });

    let sub = dialogRef.componentInstance.submitEmitter.subscribe((formControl: FormControl) => {
      if (formControl.invalid) {
        return;
      }

      let newLogin = formControl.value;
      if (newLogin == this.currentUser?.login) {
        formControl.setErrors({ using: true });
        return;
      }

      this.userService.updateLogin({ login: newLogin }).subscribe((response: LoginResponse) => {
        this.authTokenService.setToken(response.accessToken);
        this.dialogsService.openSuccessMessageDialog('Login successfully changed', `Login was successfully changed to "${newLogin}".`);
      }, (errorResponse: HttpErrorResponse) => {
        switch (errorResponse.status) {
          case 400:
            formControl.setErrors({ exists: true });
            return;
          case 401:
            this.authService.logout();
            this.dialogsService.openWarningMessageDialog('Not authenticated', `You must be authenticated to change account login.`);
            break;
          case 404:
            this.authService.logout();
            this.dialogsService.openWarningMessageDialog('Owner not found', `Owner account was not found. Maybe it was deleted.`);
          default:
            this.dialogsService.openWarningMessageDialog('Something went wrong', 'Something went wrong on the server.');
            break;
          }

          dialogRef.close();
      });
    });

    dialogRef.afterClosed().subscribe(() => sub.unsubscribe());
  }

  public logout(): void {
    this.authService.logout();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
