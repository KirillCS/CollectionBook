import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailChangedGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let id = route.queryParamMap.get('id');
    let email = route.queryParamMap.get('email');
    let token = route.queryParamMap.get('token'); 
    return id?.length > 0 && email?.length > 0 && token?.length > 0;
  }

}
