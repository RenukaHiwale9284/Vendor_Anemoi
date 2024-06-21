import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppModuleConstants } from '../app-constants';
import { VendorMngServiceService } from '../vendor-mng-service.service';
import { UserService } from '../services/user.service';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { NotificationService } from '../services/notification.service';
import { Subscription,interval, take } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES, IdleExpiry, NgIdleModule } from '@ng-idle/core';
import { Keepalive,NgIdleKeepaliveModule } from '@ng-idle/keepalive';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-business-user',
  templateUrl: './business-user.component.html',
  styleUrls: ['./business-user.component.css'],
  providers: [ConfirmationService, MessageService, PrimeIcons,Idle,Keepalive],

})
export class BusinessUserComponent implements OnInit {
  sidebar: boolean = false;

  checked1: boolean = false;

  sidebar1: boolean = false;
  user!: string;
  logUser: boolean = false;
  isActive: boolean = false;
  isActive1: boolean = false;
  isActive2: boolean = false;
  isActive3: boolean = false;
  isActive4: boolean = false;
  pageProgressBar: boolean = false;
  overlayVisible: boolean = false;
  userRole!: string;
  userName!: string;
  lastName!: string;
  private subscription!: Subscription;


  userActiveRoute:any;
  roleActiveRoute:any;
  libraryActiveRoute:any;
  projectActiveRoute:any;
  vendorActiveRoute:any;
  templateActiveRoute:any;
  scorecardActiveRoute:any;
  reportActiveRoute:any;
  activeRoute:any;


  constructor(
    private router: Router,
    private service: VendorMngServiceService,
    private userService: UserService,
    private messageService: MessageService,
    private notificationService:NotificationService,
    private idle: Idle,
    private keepalive: Keepalive
  ) {}
  allNotifications: any[] = [];
  notificationCount:any;
  ngOnInit(): void {
    this.userService.navIconSubscriber$.subscribe(
      (data:any)=>{
        // alert(data);
        
      
          if(data==='project'){
          this.roleActiveRoute=null;
          this.libraryActiveRoute=null;
          this.vendorActiveRoute=null;
          this.templateActiveRoute=null;
          this.scorecardActiveRoute=null;
          this.userActiveRoute=null;
          this.reportActiveRoute=null;
          this.projectActiveRoute='activeRoute';
        }
        else if(data==='vendors'){
          this.roleActiveRoute=null;
          this.libraryActiveRoute=null;
          this.projectActiveRoute=null;
          this.templateActiveRoute=null;
          this.scorecardActiveRoute=null;
          this.userActiveRoute=null;
          this.reportActiveRoute=null;
          this.vendorActiveRoute='activeRoute';
        }
        else if(data==='template'){
          this.roleActiveRoute=null;
          this.libraryActiveRoute=null;
          this.projectActiveRoute=null;
          this.vendorActiveRoute=null;
          this.scorecardActiveRoute=null;
          this.userActiveRoute=null;
          this.reportActiveRoute=null;
          this.templateActiveRoute='activeRoute';
        }
        else if(data==='proposal'){
          this.roleActiveRoute=null;
          this.libraryActiveRoute=null;
          this.projectActiveRoute=null;
          this.vendorActiveRoute=null;
          this.templateActiveRoute=null;
          this.userActiveRoute=null;
          this.reportActiveRoute=null;
          this.scorecardActiveRoute='activeRoute';
        }
        else if(data==='report'){
          this.roleActiveRoute=null;
          this.libraryActiveRoute=null;
          this.projectActiveRoute=null;
          this.vendorActiveRoute=null;
          this.templateActiveRoute=null;
          this.userActiveRoute=null;
          this.scorecardActiveRoute=null;
          this.reportActiveRoute='activeRoute';
        }
        else{
          this.userActiveRoute='inactiveRoute';
        }
      }
    )

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.userService.getAllNotificationsCount().subscribe((data: any) => {
      // console.log(data);
      this.notificationCount = data;
    });
    
    setInterval(() => {
      this.userService.getAllNotificationsCount().subscribe((data: any) => {
        // console.log(data);
        this.notificationCount=data;
      });
    }, 15000); //execute after every 15 seconds


    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    this.lastName = sessionStorage.getItem(AppModuleConstants.LASTNAME)!;

    // this.pageProgressBar = this.service.pageProgressBar;
    this.screenWidth = window.innerWidth;

    this.navData = [
      {
        routeLink: '/BusinessUser',
        icon: 'pi pi-chart-line',
        label: 'Project',
        image: 'assets/Images/Union 2.png',
        tooltip: 'Projects',
      },
      {
        routeLink: '/BusinessUser/vendor',
        icon: 'pi pi-users',
        label: 'Vendor',
        image: 'assets/Images/Group.png',
        tooltip: 'Vendors',
      },
      {
        routeLink: '/BusinessUser/template-list',
        icon: 'pi pi-cog',
        label: 'Templates',
        image: 'assets/Images/Union 1.png',
        tooltip: 'Templates',
      },
      {
        routeLink: '/BusinessUser/proposal-list',
        icon: 'pi pi-chart-line',
        label: 'Propsal Rating',
        image: 'assets/Images/scoring_icon.png',
        tooltip: 'Proposal Rating',
      },
      {
        routeLink: '/BusinessUser/report',
        icon: 'pi pi-chart-line',
        label: 'Reports',
        image: 'assets/Images/dashboard.png',
        tooltip: 'Reports',
      },
    ];
  }
  onClickProjects(){
    this.roleActiveRoute=null;
    this.libraryActiveRoute=null;
    this.vendorActiveRoute=null;
    this.templateActiveRoute=null;
    this.scorecardActiveRoute=null;
    this.userActiveRoute=null;
    this.reportActiveRoute=null;
    this.projectActiveRoute='activeRoute';
  }
  filterNotificationData(inputData: any) {
    let filterData: any[] = [];

    inputData.filter((data: any) => {
      // console.log('data././././', data);
      if (data.userName === sessionStorage.getItem('email')) {
        filterData.push(data);
      }
    });
    return filterData;
  }
  sideBar() {
    if (this.sidebar == false) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  onClickHome() {
    this.router.navigate(['/home']);
  }

  onClickNotification() {
    this.userService.getAllNotifications().subscribe((data: any) => {
      this.allNotifications = this.filterNotificationData(data);
      this.allNotifications.reverse();
      // console.log("updated notifications", this.allNotifications);
    });
    this.overlayVisible = !this.overlayVisible;
  }
  onClicUserMngmnt() {
    this.router.navigate(['/user-mng']);
  }

  onClicRoleMngmnt() {
    this.router.navigate(['/role-mng']);
  }

  onClicVendorMngmnt() {
    this.router.navigate(['/vendor-mng']);
  }

  onClicProjectMngmnt() {
    this.router.navigate(['/project-mng']);
  }

  onClicTemplateMngmnt() {
    this.router.navigate(['/template-mng']);
  }

  onClickLibrary() {
    this.router.navigate(['/template-mng']);
  }

  // config: boolean = false;
  // onClickConfig() {
  //   this.config = true;
  // }

  onClickAnchor() {
    this.isActive = true;
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  onClickAnchor1() {
    this.isActive = false;
    this.isActive1 = true;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData: any = [];

  isSideNavCollapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  toggleCollapse(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleCollapse1(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = false;
    }
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  onClickLogout() {
    sessionStorage.clear();
    // this.router.navigate(['/']);
    window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
  }

  onClearNotification(id: any) {
    // alert(id)
    this.userService.clearNotification(id).subscribe((data: any) => {
      // console.log('notification cleared');
      this.userService.getAllNotifications().subscribe((data: any) => {
        this.allNotifications = this.filterNotificationData(data);
        this.allNotifications.reverse();
        // console.log('updated notifications', this.allNotifications);
      });
    });
  }

  clearAllNotification(){
    this.userService.clearAllNotifications(sessionStorage.getItem('email')).subscribe((data: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success..!!',
        detail: 'All notifications are cleared',
      });
      // this.userService.getAllNotifications().subscribe((data: any) => {
      //   this.allNotifications = this.filterNotificationData(data);
      //   this.allNotifications.reverse();
      //   console.log('updated notifications', this.allNotifications);
      // });
      // this.notificationService.emitDialogFormData("event");
      this.overlayVisible=false;
      this.notificationCount=0;

    })

   
  }

    collapse = false;
  

  closeSidenav1(){
this.collapse=false
  }
  toggleCollapse11(){
    this.collapse=!this.collapse
  }
}
