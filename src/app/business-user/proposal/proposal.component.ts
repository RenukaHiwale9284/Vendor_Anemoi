import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppModuleConstants } from 'src/app/app-constants';
import { TemplateService } from 'src/app/client-user/template/template.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Proposal } from './proposal.interface';
import { ProposalService } from './proposal.service';
import { ProjectService } from 'src/app/services/project.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DraftTemplate } from '../template/newtemplate/template-details/model/template';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
export interface projectNames {
  projectName: string;
}
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ProposalComponent implements OnInit {
  proposalDetails: Proposal[] = [];
  scorecards: any[] = [];
  sectorOptions: any[] = [
    { name: 'Sample Sector', code: 1 },
    { name: 'Sample Sector 1', code: 2 },
  ];
  selectedSector!: number;

  viewOptions: any[] = [{ name: 'Proposal', code: 1 }];
  selectedView!: number;
  userRole!: string;
  userName!: string;
  isLoading: boolean = false;
  allTemplateData: any[] = [];
  allScorecardData: any[] = [];
  projectNames: projectNames[] = [];
  selectedProject!: string;
  selectedProjects!: string;
  projects: any;
  draftTemplateData!: DraftTemplate[];
  allDraftData: any[] = [];
  projectList1: any[] = [];
  projectList2: any[] = [];
  projectList3: any[] = [];
  allDecryptedData:any
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
    private service: ProposalService,
    private templateService: TemplateService,
    private vendorService: VendorMngServiceService,
    private spinner: LoadingSpinnerService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService:UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute=this.router.url
      }
    });
  }

  ngOnInit(): void {
    
    if(this.currentRoute.includes('proposal')){
      this.userService.activeNavIcon('proposal');
    }

    this.projectService.getClients().subscribe(
      (data: any) => {
        // console.log(data,'encrypted data');
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
        // console.log(key, 'key'); 
        const _iv = toArray[0]
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
          // console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        this.projects = this.allDecryptedprojectData.sort((a: any, b: any) => {
          const nameA = a.projectName.toLowerCase();
          const nameB = b.projectName.toLowerCase();

          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
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
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    // to fetch all template details
    this.vendorService
      .getTemplateDetailsByUser(
        sessionStorage.getItem(AppModuleConstants.USERNAME)
      )
      .subscribe(
        (data: any) => {
          // this.proposalDetails = data;
          console.log("data of templates===> ",data);
          
          if (this.userRole === '2') {
            this.proposalDetails =
              this.transformScoredCardData1(data).reverse();
            this.projectList1 = this.transformDraftProjectList(
              this.proposalDetails
            );
          } else if (this.userRole === '1') {
            this.proposalDetails = data.reverse();
            this.projectList1 = this.transformDraftProjectList(
              this.proposalDetails
            );
            console.log('all proposals for admin ', this.proposalDetails);
          }
          // console.log('all templates', this.proposalDetails);
        },
        (error: HttpErrorResponse) => {}
      );

    // to fetch all score cards
    this.service.getscoreCards().subscribe(
      (data: any) => {
        console.log(data,'scorecard encrypted data');
        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        // const decodedData = CryptoJS.enc.Base64.parse(base64EncodedData).toString(CryptoJS.enc.Utf8);
        // console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        console.log(toArray, 'split array');

        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(toArray[1]),
          {
            keySize: this.environment.kSize / 32,
            iterations: this.environment.cIter
          }
        );
        let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
        });
        console.log(key, 'key');

        
         const _iv = toArray[0]
        let cText1 = CryptoJS.AES.decrypt(
          cipherParams,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(_iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );
       
        // console.log( cText1.toString(CryptoJS.enc.Utf8),'decrypt data');


        try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          console.log(decryptedString,'decrypt object ???????????');
          const decryptedObject = JSON.parse(decryptedString);
          console.log(decryptedObject,'decrypt object 33434343 4324');
          
          this.allDecryptedData =decryptedObject
          console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        
        if (this.userRole === '2') {
          this.scorecards = this.transformScoredCardData(this.allDecryptedData).reverse();
          console.log("this.scorecards: ",this.scorecards);
          // debugger
          this.projectList2 = this.transformDraftProjectList1(this.scorecards);
        } else if (this.userRole === '1') {
          this.scorecards = this.allDecryptedData.reverse();
          this.projectList2 = this.transformDraftProjectList1(this.scorecards);
          console.log('all scorecards for admin', this.scorecards);
        }
        // console.log('this.scorecards: ', this.scorecards);

        // this.transformScoredCardData(this.scorecards);
        // console.log('all scorecards', this.scorecards);
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {}
    );

    this.getDraftTemplateData();
  }

  getDraftTemplateData(): void {
    this.templateService.getDraftTemplateData().subscribe((data: any) => {
      if (this.userRole === '2') {
        this.draftTemplateData =
          this.transformTempalteDraftData(data).reverse();

        this.projectList3 = this.transformDraftProjectList2(
          this.draftTemplateData
        );
      } else if (this.userRole === '1') {
        this.allDraftData = data.reverse();
        this.projectList3 = this.transformDraftProjectList2(this.allDraftData);
        // console.log("projectList3---> ",this.projectList3);
      }
      this.spinner.isLoading.next(false);
    });
  }

  transformDraftProjectList(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

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

  transformDraftProjectList1(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data.projectData.projectName;
      })
      .map((data: any) => {
        return { projectName: data.projectData.projectName };
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

  transformDraftProjectList2(inputData: any) {
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

  transformTempalteDraftData(inputData: any) {
    this.allDraftData = [];
    const allDraftDataSet = new Set();

    inputData.forEach((data: any) => {
      for (let i = 0; i < data.projectDraft.businessUser.length; i++) {
        if (
          data.projectDraft.businessUser[i] === sessionStorage.getItem('email')
        ) {
          allDraftDataSet.add(data);
          break; // Exit the loop after adding the data once
        }
      }
    });

    this.allDraftData = Array.from(allDraftDataSet);
    console.log('allDraftData by filter:', this.allDraftData);

    return this.allDraftData;
  }

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }
  transformScoredCardData(inputData: any) {
    this.allScorecardData = [];

    const allScorecardDataSet = new Set();

    inputData.forEach((data: any) => {
      for (let i = 0; i < data.projectData.businessUser.length; i++) {
        if (
          data.projectData.businessUser[i] === sessionStorage.getItem('email')
        ) {
          allScorecardDataSet.add(data);
          break; // Exit the loop after adding the data once
        }
      }
    });

    const allScorecardData = Array.from(allScorecardDataSet);
    console.log('all scorecards for business user: ', allScorecardData);

    return allScorecardData;
  }

  transformScoredCardData1(inputData: any) {
    this.allTemplateData = [];
    const allTemplateDataSet = new Set();

    inputData.forEach((data: any) => {
      for (let i = 0; i < data.project.businessUser.length; i++) {
        if (data.project.businessUser[i] === sessionStorage.getItem('email')) {
          allTemplateDataSet.add(data);
          break; // Exit the loop after adding the data once
        }
      }
    });

    this.allTemplateData = Array.from(allTemplateDataSet);
    console.log('all proposals for business user: ', this.allTemplateData);

    return this.allTemplateData;
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

  navigateProposalDetails(templateId: any) {
    if (this.userRole === '2') {
      this.router.navigate(['/BusinessUser/proposal-list/' + templateId]);
    }
    if (this.userRole === '1') {
      this.router.navigate(['/Admin/proposal-list/' + templateId]);
    }
  }

  navigateScorcardDetails(scoreCardId: any) {
    if (this.userRole === '2') {
      this.router.navigate(['/BusinessUser/scorecard/' + scoreCardId]);
    } else if (this.userRole === '1') {
      this.router.navigate(['/Admin/scorecard/' + scoreCardId]);
    }
  }

  navigateCreateTemplate(draftId: any) {
    // this.service.draftTemplateDetails = this.draftTemplateData.filter(
    //   (data: any) => {
    //     return data.draftId == draftId;
    //   }
    // )[0];

    // this.service.isDraftRedirect = true;

    // this.router.navigate([
    //   '/BusinessUser/create-template/templatedetails/' + draftId,
    // ]);

    if (this.userRole === '2') {
      this.router.navigate(['/BusinessUser/draftProposal-list/' + draftId]);
    } else if (this.userRole === '1') {
      this.router.navigate(['/Admin/draftProposal-list/' + draftId]);
    }
  }

  deleteSelectedDrafts(id: string) {
    // console.log(this.selectedDrafts, 'selected drafts');

    // console.log('deleting draft:', id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected scorecard?',
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
          detail: 'Draft not Deleted',
        });
      },
    });
  }
}
