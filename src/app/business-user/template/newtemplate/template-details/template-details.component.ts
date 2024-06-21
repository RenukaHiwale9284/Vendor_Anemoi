import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppModuleConstants } from 'src/app/app-constants';
import { ProjectService } from 'src/app/services/project.service';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { TemplateService } from '../../template.service';
import { TemplatebuilderService } from '../templatebuilder.service';
import { Template } from './model/template';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TemplateDetailsComponent implements OnInit {
  index: number = 0;
  templateForm!: FormGroup;

  projects: any;
  selectedProject: any;
  templateData!: Template;

  userRole!: string;
  userName!: string;

  draftTemplateData!: any;
  isDraftRedirect: boolean = false;
  editableUploadDoc: boolean = true;

  spinner: boolean = false;

  namePattern = '^([0-9a-zA-Z!@#$%^&*()_+ -]{3,155})$';
  descriptionPattern = '^([0-9a-zA-Z!@#$%^&,;.:""*()_+ -]{3,155})$';
  heading: boolean = false;
  allTemplates: any[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  uploadProposal: boolean = false;
  uploadMasterTemplateButton = false;
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private draftService: TemplatebuilderService,
    private templateService: TemplateService,
    private userService:UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute=this.router.url
      }
    });
  }

  ngOnInit(): void {


    if(this.currentRoute?.includes('template')){
      this.userService.activeNavIcon('template');
    }
    
    this.spinner = true;
    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    // console.log(this.activatedRoute.snapshot.params," this.activatedRoute.snapshot.params['draftId']");

    // get all templates by loggedIn user
    this.service
      .getTemplateDetailsByUser(
        sessionStorage.getItem(AppModuleConstants.USERNAME)
      )
      .subscribe(
        (data: any) => {
          this.allTemplates = data;

          // main functionality
          if (this.activatedRoute.snapshot.params['draftId']) {
            // console.log('l;l;l;l;l;l;l;l');

            this.isDraftRedirect = true;
            this.draftService
              .getDraftById(this.activatedRoute.snapshot.params['draftId'])
              .subscribe(
                (data: any) => {
                  this.draftTemplateData = data;
                  // console.log('draft data.../././.', data);
                  this.service.draftTemplateDetails = data;
                  this.selectedProject = this.draftTemplateData.projectDraft;
                  this.projects.push(this.draftTemplateData.projectDraft);
                  this.onSelectProject();

                  // console.log(data,"draft data",this.selectedProject);
                  this.templateForm = new FormGroup({
                    name: new FormControl(
                      this.draftTemplateData.templateDescription.name,
                      [Validators.required]
                    ),
                    projectName: new FormControl(data.projectDraft),
                    description: new FormControl(
                      this.draftTemplateData.templateDescription.description,
                      [Validators.required]
                    ),
                    createdBy: new FormControl(sessionStorage.getItem('email')),
                  });
                  // console.log(this.templateForm.value, 'TEMPLATE FORM');

                  this.spinner = true;
                },
                (error: HttpErrorResponse) => {
                  alert(error);
                }
              );
          } else if (this.activatedRoute.snapshot.params['templateId']) {
            // console.log('template id....!!');
            this.isDraftRedirect = true;
            this.editableUploadDoc = false;

            this.templateService
              .getTemplateById(
                this.activatedRoute.snapshot.params['templateId']
              )
              .subscribe(
                (data: any) => {
                  // console.log(data, ' template data');
                  // console.log(
                  //   'projectName: new FormControl(this.draftTemplateData.project),'
                  // );
                  console.log("template data::::",data);
                  

                  this.draftTemplateData = data;
                  this.service.draftTemplateDetails = data;
                  this.selectedProject = data.project;
                  this.projects.push(data.project);
                  // console.log(data);
                  this.templateForm = new FormGroup({
                    name: new FormControl(
                      this.draftTemplateData.templateDescription.name,
                      Validators.required
                    ),
                    description: new FormControl(
                      this.draftTemplateData.templateDescription.description
                    ),
                    projectName: new FormControl(
                      this.draftTemplateData.project
                    ),
                    createdBy: new FormControl(sessionStorage.getItem('email')),
                  });
                  // console.log(this.templateForm.value, 'TEMPLATE FORM');

                  this.spinner = true;
                },
                (error: HttpErrorResponse) => {
                  alert('error...!!');
                }
              );
          } else {
            this.heading = true;

            this.templateForm = new FormGroup({
              name: new FormControl('', [
                Validators.required,
                Validators.pattern(this.namePattern),
              ]),
              description: new FormControl('', [
                Validators.required,
                Validators.pattern(this.descriptionPattern),
              ]),
              projectName: new FormControl('', Validators.required),
              createdBy: new FormControl(sessionStorage.getItem('email')),
            });
          }
        },
        (error: HttpErrorResponse) => {}
      );

    // this.draftTemplateData = this.service.draftTemplateDetails;
    // this.isDraftRedirect = this.service.isDraftRedirect;

    // if(this.isDraftRedirect) {
    //     this.selectedProject = this.draftTemplateData.projectDraft;
    //     console.log('this.draftTemplateData: ', this.draftTemplateData)
    // }

    // this.selectedProject = this.service.draftTemplateDetails;

    this.projectService.getClients().subscribe(
      (data: any) => {
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
        // this.projects = this.allDecryptedprojectData;
        if (this.userRole === '2') {
          this.projects = this.transferProjectName1(this.allDecryptedprojectData);
 this.projects = this.projects.filter((project:any, index:any, self:any) =>
            index === self.findIndex((p:any) => p.projectName === project.projectName)
        );
          console.log("projects:===> ",this.projects);
          
        }
        else if (this.userRole === '1') {
          this.projects = this.allDecryptedprojectData;
          this.projects = this.transferProjectName1(this.allDecryptedprojectData);
            console.log("projects:===> ",this.projects);
        }
        // console.log(this.projects);
        for (let i = 0; i < this.projects.length; i++) {
          this.projects = this.projects.sort((a: any, b: any) => {
            if (a.projectName < b.projectName) return -1;
            if (a.projectName > b.projectName) return 1;
            return 0;
          });
        }

         this.projects = this.projects.filter((project:any, index:any, self:any) =>
            index === self.findIndex((p:any) => p.projectName === project.projectName)
        );
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }
  allProjectName: any[] = [];
  transferProjectName1(inputData: any) {

    console.log(inputData, 'inputData1');
    const categoryData = inputData.filter((data: any) => {
      // console.log(data, 'data of single project');
      for (let i = 0; i < data.businessUser.length; i++) {
        // console.log(data.businessUser[i]);

        if (data.businessUser[i] === sessionStorage.getItem('email')) {
          this.allProjectName.push(data);
        }
      }
    });
    console.log("this.allProjectName:",this.allProjectName);
    
    return this.allProjectName;
  }

  openNext() {
    this.redirectToTemplateCreation();
    console.log(this.templateForm.value,'template value///../');
    this.templateForm.value.createdOn = Date.now();
    this.service.templateDescriptionData = this.templateForm.value;
    this.service.project = this.selectedProject;
  }

  onSaveDraft() {
    this.templateForm.value.createdOn = Date.now();
    this.service.project = this.selectedProject;
    this.service.templateDescriptionData = this.templateForm.value;
    // console.log('project data', this.selectedProject);
    this.redirectToTemplateCreation();
    // console.log('template data', JSON.stringify(this.templateForm.value));
  }

  private redirectToTemplateCreation() {
    console.log(this.userRole,'user role');
    
    if (this.activatedRoute.snapshot.params['draftId']) {
      if (this.userRole === '2') {
        
        this.router.navigate([
          '/BusinessUser/create-template/tableDemo/' +
            this.activatedRoute.snapshot.params['draftId'],
        ]);
      } else if (this.userRole === '1') {
        this.router.navigate([
          '/Admin/create-template/tableDemo/' +
            this.activatedRoute.snapshot.params['draftId'],
        ]);
      }
    } else if (this.activatedRoute.snapshot.params['templateId']) {
      if (this.userRole === '2') {
        this.router.navigate([
          '/BusinessUser/template-list/' +
            this.activatedRoute.snapshot.params['templateId'],
        ]);
      } else if (this.userRole === '1') {
        this.router.navigate([
          '/Admin/template-list/' +
            this.activatedRoute.snapshot.params['templateId'],
        ]);
      }
    } else {
      if (this.userRole === '2') {
        this.router.navigate(['/BusinessUser/create-template/tableDemo']);
      } else if (this.userRole === '1') {
        this.router.navigate(['/Admin/create-template/tableDemo']);
      }
    }
  }

  onClickCancel() {
    // console.log("onclickcancel");
    
    this.uploadProposal = false;
    if (this.userRole === '2') {
      this.router.navigate(['/BusinessUser/template-list']);
    } else if (this.userRole === '1') {
      this.router.navigate(['/Admin/template-list']);
    }
  }

  allExistTemplates: any[] = [];
  transformedAllExistTemplatesForSinglrProject(
    allTemplates: any,
    selectedProject: any
  ) {
    // console.log(
    //   'allTemplates: ',
    //   allTemplates,
    //   ' selected project:',
    //   selectedProject
    // );

    this.allExistTemplates = [];

    // console.log(inputData, 'inputData1');
    const categoryData = allTemplates.filter((data: any) => {
      if (data.project.projectName === selectedProject.projectName) {
        this.allExistTemplates.push(data);
      }
    });
    return this.allExistTemplates;
  }

  // to check whether template is already created or not for selected project
  createdTemplate: any[] = [];
  templateExist: boolean = false;
  onSelectProject() {
    this.createdTemplate = this.transformedAllExistTemplatesForSinglrProject(
      this.allTemplates,
      this.selectedProject
    );
    // console.log(
    //   this.selectedProject,
    //   'Already createdTemplate1: ',
    //   this.allTemplates
    // );
    // console.log('Already createdTemplate: ', this.createdTemplate);

    if (this.createdTemplate.length > 0) {
      this.templateExist = true;
    } else {
      this.templateExist = false;
    }
  }

  // upload template
  uploadTemplate() {
    sessionStorage.setItem('saveEnable', 'false');
// console.log("uploadTemplate()");

    this.templateForm.value.createdOn = Date.now();

    this.service.templateDescriptionData = this.templateForm.value;
    this.service.project = this.selectedProject;
    this.uploadProposal = true;
  }
  
  @ViewChild('inputFile') fileInputRef!: ElementRef<HTMLInputElement>;
  selectFile1(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const parts = this.selectedFiles[0].name.split('.');
      const fileExtension = parts[parts.length - 1];
      console.log('fileExtension: ', fileExtension);

      if (fileExtension !== 'xlsx') {
        alert('Please select file of type Excel');

        if (this.fileInputRef && this.fileInputRef.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
        }
      }
    }
    // this.uploadProposal = false;
    this.uploadMasterTemplateButton = true;
  }

  onClickUploadMasterTemplate() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.projectService.uploadMasterTemplate(file).subscribe(
          (data: any) => {
            sessionStorage.setItem('saveEnable', 'true');
            // console.log('template uploaded', JSON.parse(data.body));
            this.templateService.masterTemplateData = JSON.parse(data.body);
            this.service.draftTemplateDetails = JSON.parse(data.body);

            if (this.userRole === '2') {
              this.router.navigate(['/BusinessUser/create-template/tableDemo']);
            } else if (this.userRole === '1') {
              this.router.navigate(['/Admin/create-template/tableDemo']);
            }
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Not valid excel format..!!',
            });
          }
        );
      }
    }
  }

  onClickHide() {
    alert('hii');
    this.uploadProposal = false;
  }

  downloadMasterTemplate() {
    this.projectService.downloadMasterTemplate().subscribe(
      (data: any) => {
        // console.log('after download', data);

        var newBlob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const data1 = window.URL.createObjectURL(newBlob);
        // console.log('link to download: ', data1);

        var link = document.createElement('a');
        link.href = data1;
        link.download = 'Master Template';
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Master template downloaded',
        });
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Something went wrong while downloading master template, please try again..!!',
        });
      }
    );
  }

  onClickCancelUpload(){
    this.uploadProposal=false;
  }
}
