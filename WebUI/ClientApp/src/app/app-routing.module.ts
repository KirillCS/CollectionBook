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
import { CollectionsComponent } from './components/profile/collections/collections.component';
import { StarsComponent } from './components/profile/stars/stars.component';
import { PreviousRouteService } from './services/previous-route.service';
import { CollectionComponent } from './components/collection/collection.component';
import { ItemComponent } from './components/item/item.component';
import { SearchComponent } from './components/search/search.component';
import { SearchCollectionsComponent } from './components/search/search-collections/search-collections.component';
import { SearchItemsComponent } from './components/search/search-items/search-items.component';
import { SearchUsersComponent } from './components/search/search-users/search-users.component';
import { NotOwnerGuard } from './guards/not-owner.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersDashboardComponent } from './components/dashboard/users-dashboard/users-dashboard.component';
import { DashboardGuard } from './guards/dashboard.guard';
import { ReportsDashboardComponent } from './components/dashboard/reports-dashboard/reports-dashboard.component';
import { CollectionsDashboardComponent } from './components/dashboard/collections-dashboard/collections-dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'emailconfirmation', component: EmailConfirmationComponent, canActivate: [EmailConfirmationGuard] },
  { path: 'emailconfirmed', component: EmailConfirmedComponent, canActivate: [EmailConfirmedGuard] },
  { path: 'emailchanged', component: EmailChangedComponent, canActivate: [EmailChangedGuard] },
  { path: 'passwordreset', component: PasswordResetComponent, canActivate: [PasswordResetGuard] },
  {
    path: 'profile/:login', component: ProfileComponent, children: [
      { path: 'collections', component: CollectionsComponent },
      { path: 'stars', component: StarsComponent }
    ]
  },
  {
    path: 'settings', component: SettingsComponent, canActivate: [AuthenticatedGuard, NotOwnerGuard], children: [
      { path: 'profile', component: ProfileSettingsComponent },
      { path: 'account', component: AccountSettingsComponent },
      { path: 'security', component: SecuritySettingsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  { path: 'collection/:id', component: CollectionComponent },
  { path: 'item/:id', component: ItemComponent },
  { path: 'new', component: CollectionCreatingComponent, canActivate: [AuthenticatedGuard, NotOwnerGuard] },
  {
    path: 'search', component: SearchComponent, children: [
      { path: 'collections', component: SearchCollectionsComponent },
      { path: 'items', component: SearchItemsComponent },
      { path: 'users', component: SearchUsersComponent },
      { path: '', redirectTo: 'collections', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard], children: [
      { path: 'reports', component: ReportsDashboardComponent },
      { path: 'users', component: UsersDashboardComponent },
      { path: 'collections', component: CollectionsDashboardComponent },
      { path: '', redirectTo: 'reports', pathMatch: 'full' }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PreviousRouteService]
})
export class AppRoutingModule { }
