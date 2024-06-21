import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  checked: boolean = false;
  dialog: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  onClickTandC() {
    this.dialog = true;
  }

  onClickLogin(){
    if(this.checked){
      this.router.navigate(['/login/loginWithPwc'])
    }else{
      alert("please accept terms and conditions")
    }
  }

}
