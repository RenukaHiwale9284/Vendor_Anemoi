import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppModuleConstants } from 'src/app/app-constants';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import {
  DraftTemplate,
  Template,
} from './newtemplate/template-details/model/template';
import { TemplateService } from './template.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class TemplateComponent implements OnInit {
  templateDetails1: Template[] = [];
  templateDetails: Template[] = [];

  userRole!: string;
  userName!: string;
  draftTemplateData!: DraftTemplate[];
  isLoading: boolean = false;

  selectedDrafts: any[] = [];

  tab2: boolean = false;
  tab1: boolean = true;
  projects: any;
  selectedProject!: string;
  selectedProjects!: string;
  selectedProjectsData!: string;
  createdByYouProjectList: any[] = [];
  sentForReviewProjects: any[] = [];
  draftProjects: any[] = [];
  draftProjects1: any[] = [];
  navData: any = [];
  currentRoute:any;
  allDecryptedprojectData:any
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };
  constructor(
    private router: Router,
    private service: VendorMngServiceService,
    private templateService: TemplateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService,
    private projectService: ProjectService,
    private userService:UserService
  ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute=this.router.url
      }
    });

  }

  ngOnInit(): void {

    if(this.currentRoute.includes('template')){
      this.userService.activeNavIcon('template');
    }


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


    this.projectService.getClients().subscribe(
      (data: any) => {
        // this.projects=;
        console.log(data,'encrypted data');
        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(toArray[1]),
          {
            keySize: this.environment.kSize / 32,
            iterations: this.environment.cIter
          }
        ); let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
        });
        console.log(key, 'key'); const _iv = toArray[0]
        let cText1 = CryptoJS.AES.decrypt(
          cipherParams,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(_iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        ); try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedprojectData =decryptedObject
          console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        if (this.userRole === '2') {
          console.log(this.allDecryptedprojectData,'all data77668768676868');
          
          this.projects = this.transferProjectName1(this.allDecryptedprojectData).sort(
            (a: any, b: any) => {
              const nameA = a.projectName.toLowerCase();
              const nameB = b.projectName.toLowerCase();

              if (nameA < nameB) {
                return -1;
              } else if (nameA > nameB) {
                return 1;
              } else {
                return 0;
              }
            }
          );
        } else {
          this.projects = data;
        }
        // console.log(data, 'projects');

        // console.log(this.projects);
        // for (let i = 0; i < data.length; i++) {
        //   this.projects = data.sort((a: any, b: any) => {
        //     if (a.projectName < b.projectName) return -1;
        //     if (a.projectName > b.projectName) return 1;
        //     return 0;
        //   });

        // }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );

    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.spinner.isLoading.next(true);

    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USERNAME)!;
    this.service.draftTemplateDetails = null;

    this.service
      .getTemplateDetailsByUser(
        sessionStorage.getItem(AppModuleConstants.USERNAME)
      )
      .subscribe(
        (data: any) => {
          this.templateDetails1 = [];
          this.templateDetails = [];

          this.spinner.isLoading.next(false);
          this.templateDetails1 = this.transformTempalteData1(data).reverse();

          this.createdByYouProjectList = this.transformProjectList(
            this.templateDetails1
          );
          // console.log(
          //   'project list created by you:',
          //   this.createdByYouProjectList
          // );

          if (this.userRole === '2') {
            this.templateDetails = this.transformTempalteData(data).reverse();
            this.sentForReviewProjects = this.transformProjectList(
              this.templateDetails
            );
          } else {
            this.templateDetails = data.reverse();
            this.sentForReviewProjects = this.transformProjectList(
              this.templateDetails
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error..!!',
            detail: "Something went wrong while fetching templates' ",
          });
        }
      );

    this.getDraftTemplateData();
  }
  allData: any[] = [];
  createdByAllData: any[] = [];
  allDraftData: any[] = [];

  allProjectName: any[] = [];
  transferProjectName1(inputData: any) {
    // console.log(inputData, 'inputData1');
    const categoryData = inputData.filter((data: any) => {
      // console.log(data, 'data of single project');
      for (let i = 0; i < data.businessUser.length; i++) {
        // console.log(data.businessUser[i]);

        if (data.businessUser[i] === sessionStorage.getItem('email')) {
          this.allProjectName.push(data);
        }
      }
    });
    return this.allProjectName;
  }

  transformTempalteData(inputData: any) {
    this.allData = [];
    const allDataSet = new Set();
    
    inputData.forEach((data: any) => {
        for (let i = 0; i < data.project.businessUser.length; i++) {
            if (data.project.businessUser[i] === sessionStorage.getItem('email')) {
                allDataSet.add(data);
                break; // Exit the loop after adding the data once
            }
        }
    });

    this.allData = Array.from(allDataSet);
    console.log('2nd tab data: ', this.allData);

    return this.allData;
  }

  transformTempalteData1(inputData: any) {
    this.createdByAllData = [];

    const createdByAllDataSet = new Set();

    for (let i = 0; i < inputData.length; i++) {
      if (
        inputData[i].templateDescription.createdBy ===
        sessionStorage.getItem('email')
      ) {
        createdByAllDataSet.add(inputData[i]);
      }
    }

    this.createdByAllData = Array.from(createdByAllDataSet);
    console.log('1st tab data: ', this.createdByAllData);

    return this.createdByAllData;
  }

  transformProjectList(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('data././././', data);

        return data.project.projectName;
      })
      .map((data: any) => {
        return { projectName: data.project.projectName };
      });

    projectData = Array.from(
      new Set(projectData.map((data: any) => JSON.stringify(data)))
    ).map((data: any) => JSON.parse(data));

    projectData.sort((a: any, b: any) => {
      const nameA = a.projectName.toLowerCase();
      const nameB = b.projectName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return projectData;
  }

  transformDraftProjectList(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data.projectDraft.projectName;
      })
      .map((data: any) => {
        return { projectName: data.projectDraft.projectName };
      });

    projectData = Array.from(
      new Set(projectData.map((data: any) => JSON.stringify(data)))
    ).map((data: any) => JSON.parse(data));

    projectData.sort((a: any, b: any) => {
      const nameA = a.projectName.toLowerCase();
      const nameB = b.projectName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    return projectData;
  }

  getDraftTemplateData(): void {
    this.templateService.getDraftTemplateData().subscribe((data: any) => {
      this.draftTemplateData = data;
      // console.log('this.draftTemplateData: ', this.draftTemplateData);

      if (this.userRole === '2') {
        this.draftTemplateData =
          this.transformTempalteDraftData(data).reverse();
        this.draftProjects = this.transformDraftProjectList(
          this.draftTemplateData
        );

        this.draftProjects = [...new Set(this.draftProjects)];
       
      } else if (this.userRole === '1') {
        this.draftTemplateData = data;
        this.draftProjects = this.transformDraftProjectList(
          this.draftTemplateData
        );
        this.draftProjects = [...new Set(this.draftProjects)];
     
      }
      this.spinner.isLoading.next(false);
    });
  }
  transformTempalteDraftData(inputData: any) {
    this.allDraftData = [];
    const allDraftDataSet = new Set();
    
    inputData.forEach((data: any) => {
        for (let i = 0; i < data.projectDraft.businessUser.length; i++) {
            if (data.projectDraft.businessUser[i] === sessionStorage.getItem('email')) {
                allDraftDataSet.add(data);
                break; // Exit the loop after adding the data once
            }
        }
    });

    this.allDraftData = Array.from(allDraftDataSet);
    console.log('3rd tab data:', this.allDraftData);

    return this.allDraftData;
  }

  onClickAddTemplate() {
   
    if (this.userRole === '2') {
      this.router.navigate(['/BusinessUser/create-template/templatedetails']);
    } else if (this.userRole === '1') {
      this.router.navigate(['/Admin/create-template/templatedetails']);
    }
    
  }
  

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  getStatusClass(status: any) {
    // console.log('status: ', status);
    switch (status) {
      case 'Pending':
        return 'status-badge status-badge-pending';
        break;
      case 'In Progress':
        return 'status-badge status-badge-progress';
      case 'Done':
        return 'status-badge status-badge-success';
    }
    return '';
  }

  navigateTemplateDetails(templateId: any) {
    this.service.templateDetails = this.templateDetails.filter((data: any) => {
      return data.templateId == templateId;
    });
    // console.log('TD: ', this.service.templateDetails);
    // console.log('this.service.templateDetails: ', this.service.templateDetails);
    // this.router.navigate(['/BusinessUser/template-list/' + templateId]);

    if (this.userRole === '2') {
      this.router.navigate([
        '/BusinessUser/create-template/templatedetails/template/' + templateId,
      ]);
    } else if (this.userRole === '1') {
      this.router.navigate([
        '/Admin/create-template/templatedetails/template/' + templateId,
      ]);
    }
  }

  navigateCreateTemplate(draftId: any) {
    // this.service.draftTemplateDetails = this.draftTemplateData.filter(
    //   (data: any) => {
    //     return data.draftId == draftId;
    //   }
    // )[0];

    // this.service.isDraftRedirect = true;
    if (this.userRole === '2') {
      this.router.navigate([
        '/BusinessUser/create-template/templatedetails/' + draftId,
      ]);
    } else if (this.userRole === '1') {
      this.router.navigate([
        '/Admin/create-template/templatedetails/' + draftId,
      ]);
    }
  }

  onClickTab(tab: any) {
    // console.log(tab, ' tab');

    if (tab === '1') {
      // console.log(tab);

      this.tab1 = true;
    } else if (tab === '2') {
      this.tab2 = true;
    }
  }
  deleteSelectedDrafts(id: string) {
    // console.log(this.selectedDrafts, 'selected drafts');

    // console.log('deleting draft:', id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.templateService.deleteSelectedDrafts(id).subscribe(
          (data: any) => {
            // console.log('deleted');
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Draft Deleted',
              life: 3000,
            });
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Draft Deleted',
              life: 3000,
            });
            this.ngOnInit();
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Draft not updated',
        });
      },
    });
  }
}
