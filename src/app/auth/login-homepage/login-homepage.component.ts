import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-homepage',
  templateUrl: './login-homepage.component.html',
  styleUrls: ['./login-homepage.component.css']
})
export class LoginHomepageComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  onClickLoginWithPwc(){
    this.router.navigate(['/login/loginWithPwc'])
  }

  onClickRegister(){
    window.location.href="https://login-stg.pwc.com/identity/registration";
  }
}
