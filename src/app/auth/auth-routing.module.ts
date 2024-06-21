import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginHomepageComponent } from './login-homepage/login-homepage.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'loginWithPwc',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
