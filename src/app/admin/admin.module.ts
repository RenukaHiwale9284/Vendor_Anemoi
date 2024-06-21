import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PrimengModule } from '../primeng/primeng.module';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { LibraryComponent } from './library/library.component';
import { PrintErrorComponent } from './print-error/print-error.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { VendorComponent } from './vendor/vendor.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ProjectComponent } from './project/project.component';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AdminComponent,
    RoleComponent,
    UserComponent,
    PrintErrorComponent,
    SpinnerComponent,
    LibraryComponent,
    VendorComponent,
    SpinnerComponent,
    ProjectComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimengModule,
    SharedModulesModule,
    RouterModule
  ]
})
export class AdminModule { }
