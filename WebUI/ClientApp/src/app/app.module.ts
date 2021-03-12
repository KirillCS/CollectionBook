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

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { API_URL, AVATARS_PATH, DEFAULT_AVATAR_PATH } from 'src/app/app-injection-tokens';
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
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EmailConfirmedComponent } from './components/email/email-confirmed/email-confirmed.component';

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
    EmailConfirmedComponent
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

    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(ACCESS_TOKEN_KEY),
        allowedDomains: environment.allowedDomains
      }
    })
  ],
  providers: [
    AuthGuard,
    EmailConfirmationGuard,
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: AVATARS_PATH, useValue: environment.avatarsPath },
    { provide: DEFAULT_AVATAR_PATH, useValue: environment.defaultAvatarsPath },
    { provide: ErrorStateMatcher, useClass: DefaultErrorStateMatcher },
    { provide: ErrorStateMatcher, useClass: SubmitErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
