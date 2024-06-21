import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppModuleConstants } from 'src/app/app-constants';
import { UserService } from 'src/app/services/user.service';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
@Component({
  selector: 'app-newtemplate',
  templateUrl: './newtemplate.component.html',
  styleUrls: ['./newtemplate.component.css'],
})
export class NewtemplateComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;
  userRole!: string;
  userName!: string;
  templateDetailsRoute: any;
  templateCreationRoute: any;
  currentRoute: any;

  constructor(
    private service: VendorMngServiceService,
    private userService: UserService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });
  }

  ngOnInit(): void {
    
    if(this.currentRoute.includes('template')){
      this.userService.activeNavIcon('template');
    }
    
    let draftId = window.location.pathname.split('/')[4];

    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USERNAME)!;

    if (this.userRole === '2') {
      this.templateDetailsRoute = [
        '/BusinessUser/create-template',
        'templatedetails',
      ];
      this.templateCreationRoute = [
        '/BusinessUser/create-template',
        'tableDemo',
      ];
    } else if (this.userRole === '1') {
      this.templateDetailsRoute = ['/Admin/create-template', 'templatedetails'];
      this.templateCreationRoute = ['/Admin/create-template', 'tableDemo'];
    }

    if (draftId) {
      this.templateDetailsRoute.push(draftId);
      this.templateCreationRoute.push(draftId);
    }

    this.items = [
      {
        label: 'Template details',
        routerLink: this.templateDetailsRoute,
        disabled: true,
      },
      {
        label: 'Template creation',
        routerLink: this.templateCreationRoute,
        disabled: true,
      },
    ];
    this.activeItem = this.items[0];
  }
}
