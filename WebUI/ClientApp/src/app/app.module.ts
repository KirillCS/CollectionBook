import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

import { ImageCropperModule } from 'ngx-image-cropper';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { API_URL, DEFAULT_AVATAR, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY } from 'src/app/services/auth.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { DefaultErrorStateMatcher } from 'src/app/error-state-matchers/default-error-state-mathcer';
import { SubmitErrorStateMatcher } from 'src/app/error-state-matchers/submit-error-state-matcher';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { EmailConfirmationComponent } from 'src/app/components/email/email-cofirmation/email-confirmation.component';
import { EmailConfirmationGuard } from 'src/app/guards/email-confirmation.guard';
import { MessageDialogComponent } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { FieldDialogComponent } from 'src/app/components/dialogs/field-dialog/field-dialog.component';
import { EmailConfirmedComponent } from 'src/app/components/email/email-confirmed/email-confirmed.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { SecuritySettingsComponent } from 'src/app/components/settings/security-settings/security-settings.component';
import { AccountSettingsComponent } from 'src/app/components/settings/account-settings/account-settings.component';
import { ProfileSettingsComponent } from 'src/app/components/settings/profile-settings/profile-settings.component';
import { DialogComponent } from 'src/app/components/dialogs/dialog/dialog.component';
import { EmailChangedComponent } from 'src/app/components/email/email-changed/email-changed.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ImageCropperDialogComponent } from './components/dialogs/image-cropper-dialog/image-cropper-dialog.component';
import { CollectionCreatingComponent } from './components/collection/collection-creating/collection-creating.component';
import { DragNDropImageComponent } from './components/drag-n-drop-image/drag-n-drop-image.component';
import { CollectionsComponent } from './components/profile/collections/collections.component';
import { StarsComponent } from './components/profile/stars/stars.component';
import { CollectionCardComponent } from './components/ui/collection-card/collection-card.component';
import { StarComponent } from './components/ui/star/star.component';
import { ProfileCollectionsComponent } from './components/ui/profile-collections/profile-collections.component';
import { SearchInputComponent } from './components/ui/search-input/search-input.component';
import { CollectionColumnComponent } from './components/home/collections-column/collections-column.component';
import { NotificationsColumnComponent } from './components/home/notifications-column/notifications-column.component';
import { CollectionComponent } from './components/collection/collection.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NotFoundComponent,
    EmailConfirmationComponent,
    MessageDialogComponent,
    FieldDialogComponent,
    EmailConfirmedComponent,
    SettingsComponent,
    SecuritySettingsComponent,
    AccountSettingsComponent,
    ProfileSettingsComponent,
    DialogComponent,
    EmailChangedComponent,
    PasswordResetComponent,
    ImageCropperDialogComponent,
    CollectionCreatingComponent,
    DragNDropImageComponent,
    CollectionsComponent,
    StarsComponent,
    CollectionCardComponent,
    StarComponent,
    ProfileCollectionsComponent,
    SearchInputComponent,
    CollectionColumnComponent,
    NotificationsColumnComponent,
    CollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatPaginatorModule,

    NgProgressModule,
    NgProgressHttpModule.withConfig({
      silentApis: environment.silentApis
    }),

    ImageCropperModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          let token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
          if (!token) {
            token = localStorage.getItem(ACCESS_TOKEN_KEY);
          }

          return token;
        },
        allowedDomains: environment.allowedDomains
      }
    })
  ],
  providers: [
    EmailConfirmationGuard,
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: DEFAULT_AVATAR, useValue: environment.defaultAvatar },
    { provide: DEFAULT_COLLECTION_COVER, useValue: environment.defaultCollectionCover },
    { provide: ErrorStateMatcher, useClass: DefaultErrorStateMatcher },
    { provide: ErrorStateMatcher, useClass: SubmitErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
