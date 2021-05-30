import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Roles } from '../models/roles';
import { CurrentUserService } from '../services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {

  public constructor(private currentUserService: CurrentUserService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.currentUserService.currentUser?.role != Roles.Owner;
  }
  
}
