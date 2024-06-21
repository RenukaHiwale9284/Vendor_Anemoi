import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BusinessUserModule } from './business-user/business-user.module';
import { ClientUserModule } from './client-user/client-user.module';
import { AuthGaurdService } from './gaurd/auth-gaurd.service';
import { BusinessUserGaurdService } from './gaurd/business-user-gaurd.service';
import { ClientUserGaurdService } from './gaurd/client-user-gaurd.service';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    loadChildren : () => AuthModule
  },
  {
    path: 'login/loginWithPwc',
    loadChildren : () => AuthModule
  },
  {
    path: 'Admin',
    loadChildren : () => AdminModule,
  },
  {
    path: 'BusinessUser',
    loadChildren : () => BusinessUserModule,
    canActivate:[BusinessUserGaurdService]
  },
  {
    path: 'ClientUser',
    loadChildren : () => ClientUserModule,
    canActivate:[ClientUserGaurdService]
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
