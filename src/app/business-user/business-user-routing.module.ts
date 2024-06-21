import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessUserComponent } from './business-user.component';
import { ProjectComponent } from './project/project.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ViewProposalComponent } from './proposal/view-proposal/view-proposal.component';
import { NewtemplateComponent } from './template/newtemplate/newtemplate.component';
import { TemplateDemoComponent } from './template/newtemplate/template-demo/template-demo.component';
import { TemplateDetailsComponent } from './template/newtemplate/template-details/template-details.component';
import { TemplateComponent } from './template/template.component';
import { ViewTemplateComponent } from './template/view-template/view-template.component';
import { VendorComponent } from './vendor/vendor.component';
import { ReportComponent } from './proposal/report/report.component';
import { ReportsComponent } from '../admin/reports/reports.component';

const businessUserChildRoutes : Routes = [
  {
    path:'',
    component:ProjectComponent
  },
  {
    path:'vendor',
    component:VendorComponent
  },
  {
    path:'template-list',
    component:TemplateComponent
  },
  {
    path:'template-list/:templateId',
    component:ViewTemplateComponent
  },
  {
    path:'create-template',
    component: NewtemplateComponent,
    children: [
      {
        path: "templatedetails",
        component: TemplateDetailsComponent,
      },
      {
        path: "templatedetails/:draftId",
        component: TemplateDetailsComponent,
      },
      {
        path: "templatedetails/template/:templateId",
        component: TemplateDetailsComponent,
      },
      {
        path: "tableDemo",
        component: TemplateDemoComponent,
      },
      {
        path: "tableDemo/:draftId",
        component: TemplateDemoComponent,
      },
    ],
  },
  {
    path:'proposal-list',
    component: ProposalComponent
  },
  {
    path:'proposal-list/:templateId',
    component: ViewProposalComponent
  },
  {
    path:'draftProposal-list/:draftId',
    component: ViewProposalComponent
  },
  {
    path:'scorecard/:scoreCardId',
    component: ViewProposalComponent
  },
  {
    path:'report',
    component: ReportsComponent
  }
];



const routes: Routes = [
  {
    path:'',
    component:BusinessUserComponent,
    children:businessUserChildRoutes
  },
  {
    path:'BusinessUser',
    component:BusinessUserComponent,
    children:businessUserChildRoutes
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessUserRoutingModule { }
