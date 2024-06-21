import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppModuleConstants } from '../app-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGaurdService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // let user = sessionStorage.getItem(AppModuleConstants.USER);
    // let role = sessionStorage.getItem(AppModuleConstants.ROLE);
    let user = sessionStorage.getItem(AppModuleConstants.USER);
    let role = sessionStorage.getItem(AppModuleConstants.ROLE);
    if (role === '1') {
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
