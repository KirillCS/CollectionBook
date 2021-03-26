import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from 'src/app/components/home/home.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { EmailConfirmationComponent } from 'src/app/components/email/email-cofirmation/email-confirmation.component';
import { EmailConfirmationGuard } from 'src/app/guards/email-confirmation.guard';
import { EmailConfirmedComponent } from 'src/app/components/email/email-confirmed/email-confirmed.component';
import { EmailConfirmedGuard } from 'src/app/guards/email-confirmed.guard';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { ProfileSettingsComponent } from 'src/app/components/settings/profile-settings/profile-settings.component';
import { AccountSettingsComponent } from 'src/app/components/settings/account-settings/account-settings.component';
import { SecuritySettingsComponent } from 'src/app/components/settings/security-settings/security-settings.component';
import { EmailChangedGuard } from 'src/app/guards/email-changed.guard';
import { EmailChangedComponent } from './components/email/email-changed/email-changed.component';
import { PasswordResetComponent } from 'src/app/components/password-reset/password-reset.component';
import { PasswordResetGuard } from 'src/app/guards/password-reset.guard';
import { CollectionCreatingComponent } from './components/collection/collection-creating/collection-creating.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'emailconfirmation', component: EmailConfirmationComponent, canActivate: [EmailConfirmationGuard] },
  { path: 'emailconfirmed', component: EmailConfirmedComponent, canActivate: [EmailConfirmedGuard] },
  { path: 'emailchanged', component: EmailChangedComponent, canActivate: [EmailChangedGuard] },
  { path: 'passwordreset', component: PasswordResetComponent, canActivate: [PasswordResetGuard] },
  { path: 'profile/:login', component: ProfileComponent },
  {
    path: 'settings', component: SettingsComponent, canActivate: [AuthenticatedGuard], children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'account', component: AccountSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: 'new', component: CollectionCreatingComponent, canActivate: [AuthenticatedGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
