import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from 'src/app/components/home/home.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { LoginComponent } from 'src/app/components/auth/login/login.component';
import { RegisterComponent } from 'src/app/components/auth/register/register.component';
import { EmailConfirmationComponent } from 'src/app/components/email/email-cofirmation/email-confirmation.component';
import { EmailConfirmationGuard } from 'src/app/guards/email-confirmation.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EmailConfirmedComponent } from 'src/app/components/email/email-confirmed/email-confirmed.component';
import { EmailConfirmedGuard } from 'src/app/guards/email-confirmed.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'emailconfirmation', component: EmailConfirmationComponent, canActivate: [EmailConfirmationGuard] },
  { path: 'emailconfirmed', component: EmailConfirmedComponent, canActivate: [EmailConfirmedGuard] },
  { path: 'profile/:login', component: ProfileComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
