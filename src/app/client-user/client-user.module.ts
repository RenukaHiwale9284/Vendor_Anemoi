import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientUserRoutingModule } from './client-user-routing.module';
import { ClientUserComponent } from './client-user.component';
import { PrimengModule } from '../primeng/primeng.module';
import { TemplateComponent } from './template/template.component';
import { TemplateDemoComponent } from './template/newtemplate/template-demo/template-demo.component';
import { EditOperationDialogComponent } from './template/newtemplate/template-demo/edit-operation-dialog/edit-operation-dialog.component';
import { CombineCategoryDialogComponent } from './template/newtemplate/template-demo/combine-category-dialog/combine-category-dialog.component';
import { SearchOperationDialogComponent } from './template/newtemplate/template-demo/search-operation-dialog/search-operation-dialog.component';
import { ViewTemplateComponent } from './template/view-template/view-template.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ViewProposalComponent } from './scorecard/view-proposal/view-proposal.component';
import {AccordionModule} from 'primeng/accordion';
import { ReportComponent } from './report/report.component';



@NgModule({
  declarations: [
    ClientUserComponent,
    TemplateComponent,
    TemplateDemoComponent,
    CombineCategoryDialogComponent,
    EditOperationDialogComponent,
    SearchOperationDialogComponent,
    ViewTemplateComponent,
    ScorecardComponent,
    ProposalComponent,
    ViewProposalComponent,
    ReportComponent,

   
  ],
  imports: [
    CommonModule,
    ClientUserRoutingModule,
    PrimengModule,
    SharedModulesModule,
    AccordionModule
  ]
})
export class ClientUserModule { }
