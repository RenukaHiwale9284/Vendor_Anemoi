import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppModuleConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})
export class BusinessUserGaurdService implements CanActivate {

  constructor(private router:Router){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let user = sessionStorage.getItem(AppModuleConstants.USER);
    let role = sessionStorage.getItem(AppModuleConstants.ROLE);
   if(role==='2' || role==='1')
   {
    return true;
   }
   this.router.navigate(['/'])
   return false;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
