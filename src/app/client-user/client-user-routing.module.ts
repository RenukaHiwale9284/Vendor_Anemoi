import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientUserComponent } from './client-user.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { ViewProposalComponent } from './scorecard/view-proposal/view-proposal.component';
import { TemplateComponent } from './template/template.component';
import { ViewTemplateComponent } from './template/view-template/view-template.component';
import { ReportComponent } from './report/report.component';
import { ReportsComponent } from '../admin/reports/reports.component';

const clientUserChildRoutes: Routes = [
  {
    path: '',
    component: TemplateComponent
  },
  {
    path: 'template-list',
    component: TemplateComponent
  },
  {
    path: 'template-list/:templateId',
    component: ViewTemplateComponent
  },
  {
    path: 'score-cards',
    component: ScorecardComponent
  },
  {
    path:'scorcard/:scoreCardId',
    component: ViewProposalComponent
  },
  {
    path:'report',
    component: ReportsComponent
  }
];

const routes: Routes = [
  {
    path: '',
    component: ClientUserComponent,
    children: clientUserChildRoutes
  },
  {
    path: 'ClientUser',
    component: ClientUserComponent,
    children: clientUserChildRoutes
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientUserRoutingModule { }
