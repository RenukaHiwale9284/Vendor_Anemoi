import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LibraryComponent } from './library/library.component';
import { RoleComponent } from './role/role.component';
import { TemplateComponent } from '../business-user/template/template.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project.component';
import { VendorComponent } from './vendor/vendor.component';
import { AuthGaurdService } from '../gaurd/auth-gaurd.service';
import { ReportsComponent } from './reports/reports.component';
import { ViewTemplateComponent } from '../business-user/template/view-template/view-template.component';
import { NewtemplateComponent } from '../business-user/template/newtemplate/newtemplate.component';
import { TemplateDetailsComponent } from '../business-user/template/newtemplate/template-details/template-details.component';
import { TemplateDemoComponent } from '../business-user/template/newtemplate/template-demo/template-demo.component';
import { ProposalComponent } from '../business-user/proposal/proposal.component';
import { ViewProposalComponent } from '../business-user/proposal/view-proposal/view-proposal.component';
import { ReportComponent } from '../business-user/proposal/report/report.component';


const roleChildRoutes : Routes = [
  {
    path:'',
    component:RoleComponent,    
  },
  {
    path:'user',
    component:UserComponent
  },
  {
    path:'master-repo',
    component:LibraryComponent
  },
  {
    path:'projects',
    component:ProjectComponent
  },
  {
    path:'vendors',
    component:VendorComponent
  },
  {
    path:'report',
    component:ReportsComponent
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
  }
];


const routes: Routes = [
  {
    path:'',
    component:AdminComponent,
    children:roleChildRoutes,
    canActivate:[AuthGaurdService]

  },
  {
    path:'Admin',
    component:AdminComponent,
    children:roleChildRoutes
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
