import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessUserRoutingModule } from './business-user-routing.module';
import { BusinessUserComponent } from './business-user.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ProjectComponent } from './project/project.component';
import { VendorComponent } from './vendor/vendor.component';
import { PrintErrorComponent } from './print-error/print-error.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { TemplateComponent } from './template/template.component';
import { CombineCategoryDialogComponent } from './template/newtemplate/template-demo/combine-category-dialog/combine-category-dialog.component';
import { EditOperationDialogComponent } from './template/newtemplate/template-demo/edit-operation-dialog/edit-operation-dialog.component';
import { SearchOperationDialogComponent } from './template/newtemplate/template-demo/search-operation-dialog/search-operation-dialog.component';
import { ViewTemplateComponent } from './template/view-template/view-template.component';
import { TemplateDemoComponent } from './template/newtemplate/template-demo/template-demo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewtemplateComponent } from './template/newtemplate/newtemplate.component';
import { TemplateDetailsComponent } from './template/newtemplate/template-details/template-details.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ViewProposalComponent } from './proposal/view-proposal/view-proposal.component';
import { SaveAsDraftDialogComponent } from './template/newtemplate/template-demo/save-as-draft-dialog/save-as-draft-dialog.component';
import {AccordionModule} from 'primeng/accordion';
import {OrderListModule} from 'primeng/orderlist';
import { ReportComponent } from './proposal/report/report.component';



@NgModule({
  declarations: [
    BusinessUserComponent,
    ProjectComponent,
    VendorComponent,
    PrintErrorComponent,
    SpinnerComponent,
    TemplateComponent,
    TemplateDemoComponent,
    CombineCategoryDialogComponent,
    EditOperationDialogComponent,
    SearchOperationDialogComponent,
    ViewTemplateComponent,
    NewtemplateComponent,
    TemplateDetailsComponent,
    TemplateDemoComponent,
    ProposalComponent,
    ViewProposalComponent,
    SaveAsDraftDialogComponent,
    ReportComponent,

  ],
  imports: [
    CommonModule,
    SharedModulesModule,
    BusinessUserRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    AccordionModule,
    OrderListModule,
  ]
})
export class BusinessUserModule { }
