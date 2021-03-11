import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "src/app/services/auth.service";
import { EmailConfirmationService } from "src/app/services/email-confirmation.service";

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(private authService: AuthService, private emailService: EmailConfirmationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      return false;
    }
    
    let id = route.queryParamMap.get('id');
    let email = route.queryParamMap.get('email');
    if (!id || !email) {
      return false;
    }

    let isConfirmed: boolean;
    this.emailService.isEmailConfirmed(id).subscribe(response => isConfirmed = response, error => {
      console.log(error);
    })
    
    return !isConfirmed;
  }
}