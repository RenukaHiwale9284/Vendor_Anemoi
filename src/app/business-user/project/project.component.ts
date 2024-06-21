import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BusinessUser,
  Client,
  DocData,
  Industry,
  Manager,
  newProject,
  Partner,
  Project,
  Rfp,
} from './model/project';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/admin/user/model/user';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { LibraryService } from 'src/app/services/library.service';
import { VendorService } from 'src/app/services/vendor.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
export interface encreptedDataObject {
  encreptedData?: any;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ConfirmationService, MessageService, PrimeIcons],
})
export class ProjectComponent implements OnInit {
  newProjectDialog: boolean = false;

  @ViewChild('inputFile') myInputVariable: any;

  clientForm1!: FormGroup;
  addIndustryForm!: FormGroup;
  clientForm2!: FormGroup;
  clientForm3!: FormGroup;
  projectForm!: FormGroup;
  rfpForm!: FormGroup;

  clientInfo: newProject[] = [];
  projectInfo: Project[] = [];
  rfpInfo: Rfp[] = [];

  results: any[] = [];
  files: any;

  selectedIndustry!: string;
  selectedPartner!: string;
  selectedManager!: string;
  selectedBusinessUserName: string[] = [];

  clientData: any;
  projectData: any;
  rfpData: any;

  businessUsers: BusinessUser[] = [];
  managers: Manager[] = [];
  partners: Partner[] = [];

  industryNames: Industry[] = [];

  index!: number;
  newindex!: number;
  categoriesData: any[] = [];

  //edit functionalty
  newprojectData!: newProject;
  editProjectDialog: boolean = false;

  selectedFiles?: FileList;
  selectedFiles1?: FileList;
  currentFile?: File;
  currentFile1?: File;

  docData: DocData[] = [];
  currentRfp!: DocData;
  selectedId: string[] = [];
  dt1: any;
  editable: boolean = false;
  sourceProducts: any;
  targetProducts: any[] = [];
  allDecryptedprojectData: any
  allDecryptedvendorData: any
  openNext() {
    this.index = this.index === 3 ? 0 : this.index + 1;
  }
  openPrev() {
    this.index = this.index === 0 ? 3 : this.index - 1;
    // this.index = this.index === 0 ? 3 : this.index - 1;
  }

  openNextUpdate() {
    this.newindex = this.newindex === 2 ? 0 : this.newindex + 1;
  }

  openPrevUpdate() {
    this.newindex = this.newindex === 0 ? 2 : this.newindex - 1;
  }

  editClientForm: boolean = false;
  clientFormId!: string;

  // projectCodePattern = "^[a-zA-Z0-9]{3,15}$";
  descriptionPattern = '^([0-9a-zA-Z!@#$%^&,.;:""*()_+ -]{3,255})$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';
  clientnamePattern = '^([0-9a-zA-Z!@#$%^&*()_+ -]{3,155})$';
  //  clientnamePattern = '/^(?=.*\d)(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]+$/';
  // emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';

  firstNamePattern = '^([a-zA-Z ]{3,155})$';
  lastNamePattern = '^([a-zA-Z ]{3,155})$';
  projectnamePattern = '^([0-9a-zA-Z!@#$%^&*()_+ ]{3,155})$';
  projectcodePattern = '^[a-zA-Z0-9 .]+$';
  rfpNamePattern = '^([0-9a-zA-Z!@#$%^&*()_+ ]{3,50})$';
  industryPattern = '[^<>]*'
  constructor(
    private fb: FormBuilder,
    private vendorService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private user: UserService,
    private masterRepoService: LibraryService,
    private spinner: LoadingSpinnerService,
    private vendor: VendorService
  ) {
    masterRepoService.getCategories().subscribe((data: any) => {
      this.industryNames = this.transformCategoryData(data);
    });
    // this.industryNames = [
    //   { industryName: 'Commerce' },
    //   { industryName: 'Construction' },
    //   { industryName: 'Financial' },
    //   { industryName: 'IT' },
    //   { industryName: 'Manufacturing' },
    // ];

    this.businessUsers = [
      { name: 'Ananya' },
      { name: 'Sangam' },
      { name: 'Rahul' },
      { name: 'Ashutosh' },
    ];

    this.managers = [
      {
        name: 'Aniruddha Chakraborty',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Manjunathv Gowda',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Pranjal Nolakha',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Rohit Sharma',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'Kolkata',
        LOS: 'Advisory',
      },

      {
        name: 'Sachin Madhukar Khaire',
        email: 'sachin.madhukar.khaire.tpr@pwc.com',
        designation: 'Manager',
        location: 'Gurugram',
        LOS: 'Advisory',
      },

      {
        name: 'Samson Daniel',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Subhajit Saha',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'Kolkata',
        LOS: 'Advisory',
      },
      {
        name: 'Sounak Sarkar',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'BENGALURU',
        LOS: 'Advisory',
      },
      {
        name: 'Shruti  Solanki',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Manager',
        location: 'BENGALURU',
        LOS: 'Advisory',
      },
      {
        name: 'Vikas Batra',
        email: 'vikas.batra@pwc.com',
        designation: 'Manager',
        location: 'Gurugram',
        LOS: 'Advisory',
      },
    ];

    this.partners = [
      {
        name: 'Ashootosh Chand',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'BENGALURU',
        LOS: '',
      },
      {
        name: 'Mihir Gandhi',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'MUMBAI',
        LOS: '',
      },
      {
        name: 'Rameshwar Solange',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'MUMBAI',
        LOS: '',
      },
    ];

    this.skillsForm = this.fb.group({
      skills: this.fb.array([this.newSkill()]),
    });
  }

  form!: FormGroup;
  projectId: string = '';
  allUsers: User[] = [];
  isLoading: boolean = false;

  skillsForm!: FormGroup;
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };
  newEncryptedObject!: encreptedDataObject;
  encryptUserData: any
  userDataString: any
  allDecryptedData: any
  onShow() {
    this.skills.push(this.newSkill());
  }

  ngOnInit(): void {
    this.sourceProducts = [];
    this.targetProducts = [];
    this.clientInfo = [];

    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.spinner.isLoading.next(true);

    this.addIndustryForm = new FormGroup({
      industry: new FormControl('', [Validators.required, Validators.pattern(this.industryPattern)]),
    });

    this.clientForm1 = new FormGroup({
      clientName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.clientnamePattern),
      ]),
      industry: new FormControl(''),
      firstName: new FormControl('', Validators.pattern(this.firstNamePattern)),
      lastName: new FormControl('', Validators.pattern(this.lastNamePattern)),
      email: new FormControl('', Validators.pattern(this.emailPattern)),

      projectName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.projectnamePattern),
      ]),
      projectCode: new FormControl('', [
        Validators.pattern(this.projectcodePattern),
      ]),
      partnerName: new FormControl(
        '',
        Validators.pattern(this.firstNamePattern)
      ),
      managerName: new FormControl(
        '',
        Validators.pattern(this.firstNamePattern)
      ),
      businessUser: new FormControl(''),
      selectedVendors: new FormControl(''),

      rfpName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.rfpNamePattern),
      ]),
      file: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.pattern(this.descriptionPattern),
      ]),
      // date: new FormControl(''),
      // createdOn: new FormControl(''),
      createdBy: new FormControl(''),
      modifiedBy: new FormControl(''),
      createdOn: new FormControl(''),
      modifiedOn: new FormControl(''),
    });

    // to fetch all clients info
    this.vendorService.getClients().subscribe(
      (data: any) => {
        console.log(data, 'encrypted data');
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
          this.allDecryptedprojectData = decryptedObject
          console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }

        this.clientInfo = [];
        this.clientInfo = this.allDecryptedprojectData.reverse();
        console.log("all project data for admin: ", this.clientInfo);

        this.clientInfo = this.transferProjectName1(this.clientInfo);

        console.log('all projects for admin:', this.clientInfo);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    this.user.getuUser().subscribe(
      (data: any) => {

        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        let toArray = decodedData.split(this.environment.kSeparator);
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

        try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedData = decryptedObject
          console.log(this.allDecryptedData, 'decrypted object in user for project');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }

        // this.allUsers = data;
        this.allUsers = this.getActiveUsers(this.allDecryptedData);
        // console.log('all active users: ', this.allUsers);

        // for (let i = 0; i < this.allUsers.length; i++) {
        //   this.allUsers = this.allUsers.sort((a: any, b: any) => {
        //     if (a.email < b.email) return -1;
        //     if (a.email > b.email) return 1;
        //     return 0;
        //   });
        // }
      },
      (error: HttpErrorResponse) => {
        // console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error..!!',
          detail: 'Something went wrong, please try again..!!',
        });
      }
    );

    this.targetProducts = [];
    // to get all vendors
    this.vendor.getVendors().subscribe(
      (data: any) => {

        console.log(data, 'encrypted data');
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

        console.log(cText1, 'cetext1');

        try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedvendorData = decryptedObject
          console.log(this.allDecryptedvendorData, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }

        this.sourceProducts = this.transformVendorNames(this.allDecryptedvendorData);
        // console.log('all Vendors.....!!:', this.sourceProducts);
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
        this.spinner.isLoading.next(false);
      }
    );

    this.spinner.isLoading.next(false);
  }

  // getActiveUsers(data: any) {
  //   console.log(data, ' all users');

  //   for (let i = 0; data.length; i++) {
  //     console.log(data[i].userStatus);

  //     if (data[i].userStatus === 'Active') {
  //       const activeUsers = data[i];
  //       this.allUsers.push(activeUsers);
  //     }
  //   }
  //   console.log('././.', this.allUsers);
  // }

  getActiveUsers(data: any) {
    // console.log(data, ' all users');

    const activeUsers = data
      .filter((user: any) => user.userStatus === 'Active')
      .sort((a: any, b: any) => {
        // console.log('abababababa?????', a, b);

        const nameA = a.email.toLowerCase();
        const nameB = b.email.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

    // console.log('././.', activeUsers);
    return activeUsers;
  }

  transferProjectName1(inputData: any) {
    let allProjectName: any[] = [];
    // console.log(inputData, 'inputData1');
    const allProjectSet = new Set();

    inputData.forEach((data: any) => {
      for (let i = 0; i < data.businessUser.length; i++) {
        if (data.businessUser[i] === sessionStorage.getItem('email')) {
          allProjectSet.add(data);
          break; // Exit the loop after adding the project once
        }
      }
    });

    allProjectName = Array.from(allProjectSet);
    console.log("all project list with transformed: ", allProjectName);

    return allProjectName;
  }
  passengerForm = [
    {
      firstname: '',
      lastname: '',
      email: '',
    },
  ];
  addFormBOx: boolean = false;
  addForm() {
    this.addFormBOx = true;
    this.passengerForm.push({
      firstname: '',
      lastname: '',
      email: '',
    });
  }

  removeForm() {
    this.passengerForm.pop();
  }
  flagAdding: boolean = false;

  onClickAddIndustry() {
    this.flagAdding = true;
  }

  onClickSaveIndustry() {
    // console.log(this.addIndustryForm.value, 'Industry / Sector.....');
    const industryName1 = {
      // industryName:this.addIndustryForm.value.industry
      value: this.addIndustryForm.value.industry,
      type: 'Industry',
    };
    // this.industryNames.push(industryName1);

    // console.log(this.industryNames,'this.industryNames');
    this.flagAdding = false;

    //Add industry
    this.masterRepoService.addCategory(industryName1).subscribe(
      (data: any) => {
        this.masterRepoService.getCategories().subscribe(
          (data: any) => {
            // console.log(data, 'data./....');

            // console.log(this.categoriesData, ' data');

            this.industryNames = this.transformCategoryData(data);

            // this.spinner.isLoading.next(false);
          },
          (error: any) => {
            // alert(error);
            // this.spinner.isLoading.next(false);
            this.messageService.add({
              severity: 'Error',
              summary: 'Error',
              detail: 'Error while fetching master library details..!!',
            });
          }
        );
        this.messageService.add({
          severity: 'success',
          summary: 'success...!!',
          detail: 'Industry added',
        });
        // this.spinner.isLoading.next(false);
        // this.categoryForm.reset();
        // this.ngOnInit();
        // console.log(data, 'data');
      },
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.messageService.add({
            severity: 'warn',
            summary: 'error...!!',
            detail: 'Line item already present in library',
          });
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'error...!!',
            detail: 'something went wrong, try again',
          });
        }
        // this.spinner.isLoading.next(false);
      }
    );
  }

  categoriesData1: any[] = [];
  transformCategoryData(inputData: any) {
    const industryNames = inputData
      .filter((item: any) => item.type === 'Industry')
      .map((item: any) => ({ industryName: item.value }))
      .sort((a: any, b: any) => {
        const nameA = a.industryName.toLowerCase();
        const nameB = b.industryName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

    return industryNames;
  }

  onClickCancle1() {
    this.addIndustryForm.reset();
    this.flagAdding = false;
  }
  onClickCancel() {
    this.editable = false;
    this.businessOwnerId = [];
    this.sourceProducts = [];
    this.targetProducts = [];
    this.editClientForm = false;
    this.projectEditable = false;
    this.reasonToDetagDialog = false;
    this.newProjectDialog = false;
    this.editProjectDialog = false;
    this.clientForm1.reset();
    this.skillsForm.reset();
    this.passengerForm = [
      {
        firstname: '',
        lastname: '',
        email: '',
      },
    ];

    // to make selectedFiles1 variable as null
    this.myInputVariable.nativeElement.value = '';
    this.files = { ...this.selectedFiles1?.item(0) };
    this.files = null;

    // to make selectedFiles variable as null
    this.myInputVariable.nativeElement.value = '';
    this.files = { ...this.selectedFiles?.item(0) };
    this.files = null;

    this.skillsForm.value.skills.controls = null;

    for (let i = 0; i < this.skillsForm.value.skills.length; i++) {
      this.removeSkill((i = 0));
    }

    this.ngOnInit();
  }
  @ViewChild('inputFile') fileInputRef!: ElementRef<HTMLInputElement>;
  selectFile(event: any): void {
    const files = event.target.files;

    console.log("files:", files);

    const file = files.item(0);

    if (file) {
      this.getMimeType(file).then(mimeType => {
        console.log('MIME Type:', mimeType);
        if (mimeType !== 'pdf') {
          alert('Please select a file of type pdf');
          this.clearFileInput();
        } else {
          this.selectedFiles = event.target.files;
        }
      });
    }
  }


  private getMimeType(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        // Check the MIME type based on the file header
        let mimeType = '';
        switch (header) {
          case '89504e47':
            mimeType = 'image/png';
            break;
          case '47494638':
            mimeType = 'image/gif';
            break;
          case '25504446':
            mimeType = 'pdf';
            break;
          case 'ffd8ffe1':
          case 'ffd8ffe2':
            mimeType = 'image/jpeg';
            break;
          default:
            mimeType = 'application/octet-stream'; // Default MIME type
            break;
        }

        resolve(mimeType);
      };

      reader.readAsArrayBuffer(file);
    });
  }



  selectFile1(event: any): void {
    const files = event.target.files;

    console.log("files:", files);

    const file = files.item(0);

    if (file) {
      this.getMimeType(file).then(mimeType => {
        console.log('MIME Type:', mimeType);
        if (mimeType !== 'pdf') {
          alert('Please select a file of type pdf');
          this.clearFileInput();
        } else {
          this.selectedFiles1 = event.target.files;
        }
      });
    }
  }

  clearFileInput(): void {
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }


  Download(data: any) {
    this.vendorService.getDocDataBYProjectId(data.projectId).subscribe(
      (data1: any) => {
        // console.log(data1, ' doc data by peoject id');
        let id = data1.docName;
        if (data1.docKey) {
          this.vendorService.downloadFile(data1.docKey).subscribe(
            (x: any) => {
              // console.log(x,"..!!");

              var newBlob = new Blob([x], { type: 'application/pdf' });

              const data1 = window.URL.createObjectURL(newBlob);

              var link = document.createElement('a');
              link.href = data1;
              link.download = id;
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );
            },
            (error: HttpErrorResponse) => {
              alert('unable to download file');
            }
          );
        } else {
          alert('Document not found...!!');
        }
      },
      (error: HttpErrorResponse) => {
        alert('Unable to download document..!!');
      }
    );
  }

  onClickDownload(projectid: string, version: string) {
    this.vendorService.downloadDocByVersion(projectid, version).subscribe(
      (event: Blob) => {
        var newBlob = new Blob([event], { type: 'application/pdf' });

        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        link.download = projectid;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      },
      (error: HttpErrorResponse) => {
        // console.log('error');
      }
    );
  }

  document!: Document;
  onUpload(projectData: any, file: any) {
    this.spinner.isLoading.next(true);

    this.vendorService.uploadDoc(file).subscribe(
      (data: any) => {
        // console.log(data, 'file to be upload', projectData);
        if (data.type != 0) {
          this.document1(data, projectData, file);
        }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong while uploading document..11');
      }
    );
  }

  document1(data: any, projectData: any, file: any) {
    let document = {
      docName: file.name,
      docType: 'RFP',
      docKey: data.body,
      projectId: projectData.projectId,
      version: '1.0',
    };
    this.vendorService.document(document).subscribe(
      (data: any) => {
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong while uploading document');
      }
    );
  }

  updateDocument1(data: any, projectData: any, file: any) {
    this.vendorService.getDocDataBYProjectId(projectData.projectId).subscribe(
      (data1: any) => {
        let document = {
          docName: file.name,
          docType: 'RFP',
          docKey: data.body,
          projectId: projectData.projectId,
          version: '1.0',
        };
        // console.log(document, 'Narendra');

        this.vendorService
          .updateDocument(data1.docId, document)
          .subscribe((data: any) => {
            // console.log(data, 'Naru More');
          });
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong while uploading document');
      }
    );

    let document = {
      docName: projectData.rfpName,
      docType: 'RFP',
      docKey: data.body,
      projectId: projectData.projectId,
      version: '1.0',
    };
    // console.log(document, 'Narendra');

    this.vendorService.document(document).subscribe(
      (data: any) => {
        // console.log(data, 'Naru More');
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong while uploading document');
      }
    );
  }

  onEditUpload(projectData: any, file: any) {
    this.spinner.isLoading.next(true);

    this.currentFile1 = file;
    this.vendorService.uploadDoc(file).subscribe(
      (data: any) => {
        this.spinner.isLoading.next(false);

        // this.ngOnInit();
        if (data.type != 0) {
          this.updateDocument1(data, projectData, file);
        }
      },
      (error: HttpErrorResponse) => {
        // console.log('error');
        this.spinner.isLoading.next(false);
      }
    );
  }

  onClickAddProject() {
    this.index = 0;
    this.newProjectDialog = true;

    for (let i = 0; i < this.skillsForm.value.skills.length; i++) {
      this.removeSkill((i = 0));
    }
    //  this.ngOnInit();
  }

  //           <!-- save button  for client-->

  projectData1: any;
  onClickSaveClient() {
    this.newProjectDialog = false;
    this.spinner.isLoading.next(true);

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.clientForm1.value.document = file.name;
        this.clientForm1.value.createdBy = sessionStorage.getItem('email');
        this.clientForm1.value.modifiedBy = sessionStorage.getItem('email');
        this.clientForm1.value.businessUser.push(
          sessionStorage.getItem('email')
        );

        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].role.roleName === 'Admin') {
            this.clientForm1.value.businessUser.push(this.allUsers[i].email);
          }
        }
        // console.log("this.skillsForm.value.skills: ",this.skillsForm.value.skills);

        // this.clientForm1.value.businessOwner = this.skillsForm.value.skills[0];

        // console.log('this.clientForm1.value: ', this.clientForm1.value);

        this.clientForm1.value.selectedVendors = this.transformVendorNames1(
          this.targetProducts
        );

        // console.log(
        //   'this.clientForm1.value.selectedVendors: ',
        //   this.clientForm1.value.selectedVendors
        // );


        const jsonString = JSON.stringify(this.clientForm1.value);
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(salt),
          {
            keySize: this.environment.kSize / 32, iterations: this.environment.cIter
          }
        );
        console.log('key ###', key);
        console.log('jsonString ###', jsonString);
        let cText = CryptoJS.AES.encrypt(
          jsonString,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );
        console.log('key ###', key);
        console.log('Iv ###', iv);
        console.log('salt ###', salt);
        let aesText = iv + this.environment.kSeparator + salt + this.environment.kSeparator + cText.ciphertext.toString(CryptoJS.enc.Base64);
        let aesFinalText = btoa(aesText);
        console.log("aesText: ", aesFinalText);
        this.newEncryptedObject = {};
        this.newEncryptedObject.encreptedData = aesFinalText;
        console.log('string data', aesFinalText);


        this.vendorService.addClient(this.newEncryptedObject).subscribe(
          (data: any) => {
            this.projectId = data.projectid;
            // this.projectData1 = JSON.parse(data);
            this.projectData1 = data;
            this.newProjectDialog = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Project data saved successfully',
            });
            this.spinner.isLoading.next(false);

            this.ngOnInit();
            this.onUpload(this.projectData1, file);
            this.clientForm1.reset();

            // to make selectedFiles variable as null
            this.myInputVariable.nativeElement.value = '';
            this.files = { ...this.selectedFiles?.item(0) };
            this.files = null;

            for (let i = 0; i < this.skillsForm.value.skills.length; i++) {
              this.removeSkill((i = 0));
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === 406) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning...!!',
                detail:
                  'Duplicate project name , project code or business owner email-Id no allowed',
              });
              this.spinner.isLoading.next(false);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error...!!',
                detail: 'Error while adding Project...!!',
              });
              this.spinner.isLoading.next(false);
            }
            // console.log(JSON.stringify(this.clientForm1.value), ' akshay');
            // this.clientForm1.reset();
            // this.newProjectDialog = false;
            // this.ngOnInit();
          }
        );
      }
    }
  }

  transformVendorNames(inputData: any) {
    return inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data.vendorName;
      })
      .map((data: any) => {
        return { vendorName: data.vendorName };
      })
      .sort((a: any, b: any) => {
        return a.vendorName.localeCompare(b.vendorName);
      });

    // .sort((a: string, b: string) => a.localeCompare(b));
  }

  transformVendorNames1(inputData: any) {
    return inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data.vendorName;
      })
      .map((data: any) => {
        return data.vendorName;
      })
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  transformVendorNames2(inputData: any) {
    return inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data;
      })
      .map((data: any) => {
        return { vendorName: data };
      })
      .sort((a: any, b: any) => {
        return a.vendorName.localeCompare(b.vendorName);
      });

    // .sort((a: string, b: string) => a.localeCompare(b));
  }

  transformVendorNames3(inputData: any) {
    // console.log(this.sourceProducts, '-------------------', inputData);

    let newArray: any[] = [];
    for (let i = 0; i < this.sourceProducts.length; i++) {
      let found = false; // Flag to indicate if the vendor is found in inputData

      for (let j = 0; j < inputData.length; j++) {
        if (this.sourceProducts[i].vendorName === inputData[j].vendorName) {
          found = true; // Vendor found in inputData, set the flag to true
          break; // No need to check further, exit the inner loop
        }
      }

      if (!found) {
        newArray.push(this.sourceProducts[i]); // Add the vendor to newArray if not found in inputData
      }
    }

    // console.log("newArray''''''''''", newArray);
    return newArray;
  }

  passengerData: any[] = [];
  allDetaggedVendors: any[] = [];
  allScoredVendors: any[] = [];
  uploadedRfp: any;
  projectEditable: boolean = false;
  editProject(data: any) {
    this.projectEditable = true;
    this.vendorService.getDocDataBYProjectId(data.projectId).subscribe(
      (data1: any) => {
        // console.log('projectRfp details: ', data1);

        this.uploadedRfp = data1.docName;
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    this.vendorService.getProjectById(data.projectId).subscribe(
      (data: any) => {
        // this.sourceProducts=[];
        // this.targetProducts=[];
        // console.log(data, 'data');

        this.newprojectData = data;

        this.index = 0;
        this.newprojectData = data;

        this.clientForm1
          .get('clientName')
          ?.patchValue(this.newprojectData.clientName);

        this.clientForm1
          .get('industry')
          ?.patchValue(this.newprojectData.industry);

        this.clientFormId = this.newprojectData.projectId;

        this.clientForm1
          .get('projectName')
          ?.patchValue(this.newprojectData.projectName);

        this.clientForm1
          .get('projectCode')
          ?.patchValue(this.newprojectData.projectCode);

        this.clientForm1
          .get('partnerName')
          ?.patchValue(this.newprojectData.partnerName);
        this.clientForm1
          .get('managerName')
          ?.patchValue(this.newprojectData.managerName);
        this.clientForm1
          .get('businessUser')
          ?.patchValue(this.newprojectData.businessUser);
        this.clientForm1
          .get('rfpName')
          ?.patchValue(this.newprojectData.rfpName);
        this.clientForm1
          .get('description')
          ?.patchValue(this.newprojectData.description);

        // this.clientForm1
        //   .get('businessOwner')
        //   ?.patchValue(this.newprojectData.businessOwner);
        this.clientForm1
          .get('createdOn')
          ?.patchValue(this.newprojectData.createdOn);
        this.clientForm1
          .get('createdBy')
          ?.patchValue(this.newprojectData.createdBy);
        this.clientForm1
          .get('firstName')
          ?.patchValue(this.newprojectData.firstName);
        this.clientForm1
          .get('lastName')
          ?.patchValue(this.newprojectData.lastName);

        this.clientForm1.get('email')?.patchValue(this.newprojectData.email);

        this.clientForm1
          .get('selectedVendors')
          ?.patchValue(this.newprojectData.selectedVendors);

        this.targetProducts = this.transformVendorNames2(
          this.newprojectData.selectedVendors
        );
        // this.targetProducts=this.newprojectData.selectedVendors.sort((a: string, b: string) => a.localeCompare(b));;

        // this.sourceProducts=this.sourceProducts.filter((x:any) => !this.newprojectData.selectedVendors.includes(x))
        this.sourceProducts = this.transformVendorNames3(this.targetProducts);

        // console.log("/'/'/'/'/'/'/'/", this.clientForm1.value);

        // console.log(this.clientForm1.value,".//././././././.");

        // let controls: any = new FormArray([]);
        // this.newprojectData.businessOwner.forEach(
        //   (projectOwnerControl: any, index: number) => {
        //     controls.push(
        //       new FormGroup({
        //         firstname: new FormControl(projectOwnerControl.firstname),
        //         lastname: new FormControl(projectOwnerControl.lastname),
        //         email: new FormControl(projectOwnerControl.email),
        //         id: new FormControl(projectOwnerControl.id),
        //       })
        //     );
        //   }
        // );

        // this.skillsForm = new FormGroup({ skills: controls });
        // console.log(this.skillsForm, '....');

        // console.log(this.clientForm1.value, ' editable form');

        this.editClientForm = true;
        this.newProjectDialog = true;

        // get all detagged vendors
        this.vendorService
          .getDetaggedVendors(this.newprojectData.projectId)
          .subscribe(
            (data: any) => {
              // console.log('data affter tagged: ', data);
              this.allDetaggedVendors = data;
            },
            (error: HttpErrorResponse) => {
              alert(error);
            }
          );

        // to get all scorecards by project id
        // this.vendorService
        //   .getScorecardsByProjectId(this.newprojectData.projectId)
        //   .subscribe(
        //     (data: any) => {
        //       console.log('scorecards by project Id: ', data);
        //       this.allScoredVendors = data;
        //     },
        //     (error: HttpErrorResponse) => {
        //       alert(error);
        //     }
        //   );

        // check logged in user details

        const jsonString = JSON.stringify(this.newprojectData.createdBy);
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(salt),
          {
            keySize: this.environment.kSize / 32, iterations: this.environment.cIter
          }
        );
        console.log('key ###', key);
        console.log('jsonString ###', jsonString);
        let cText = CryptoJS.AES.encrypt(
          jsonString,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );
        console.log('key ###', key);
        console.log('Iv ###', iv);
        console.log('salt ###', salt);



        let aesText = iv + this.environment.kSeparator + salt + this.environment.kSeparator + cText.ciphertext.toString(CryptoJS.enc.Base64);
        let aesFinalText = btoa(aesText);
        console.log("aesText: ", aesFinalText);

        this.newEncryptedObject = {};

        this.newEncryptedObject.encreptedData = aesFinalText;
        this.encryptUserData = aesFinalText
        console.log('email string data', this.encryptUserData);

        this.user.getUserByMailId(this.encryptUserData).subscribe(
          (data: any) => {
            // console.log('logged in user: ', data);
            console.log(data, 'encrypted data');

            const base64EncodedData = data;
            const decodedData = atob(base64EncodedData);
            console.log(decodedData, 'decode data');
            let toArray = decodedData.split(this.environment.kSeparator);
            console.log(toArray, 'array');

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
            try {
              // debugger
              const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
              // const decryptedObject = JSON.parse(decryptedString);
              console.log(decryptedString, 'decrypted object user in project');
              this.userDataString = decryptedString;
            } catch (error) {
              console.error('Error parsing decrypted data as JSON:', error)
            }


            if (this.userDataString.email === sessionStorage.getItem('email')) {
              this.editable = false;
            } else {
              this.editable = true;
            }
          },
          (error: HttpErrorResponse) => {
            alert('User details not found...!!');
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );
  }

  transformSourceVendorList(inputData: any) {
    return inputData
      .filter((data: any) => {
        // console.log('draft data????????????', data);

        return data.projectDraft.projectName;
      })
      .map((data: any) => {
        return { projectName: data.projectDraft.projectName };
      });
  }

  onClickUpdateClient() {
    this.clientForm1.value.businessOwner = this.skillsForm.value.skills;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Project?',
      accept: () => {
        this.newProjectDialog = false;
        this.spinner.isLoading.next(true);
        this.clientForm1.value.modifiedBy = sessionStorage.getItem('email');
        this.clientForm1.value.selectedVendors = this.transformVendorNames1(
          this.targetProducts
        );

        this.vendorService
          .updateProject(this.clientForm1.value, this.clientFormId)
          .subscribe(
            (data: any) => {
              // console.log('Project Details Updated' + data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project updated Successfully',
              });
              this.spinner.isLoading.next(false);

              if (this.selectedFiles1) {
                const file: File | null = this.selectedFiles1.item(0);

                if (file) {
                  this.onEditUpload(data, file);
                }
              }

              if (this.detagVendorsWithReason.length > 0) {
                this.detagVendorsWithReason.forEach((object) => {
                  this.vendorService.addDetaggedVendor(object).subscribe(
                    (data: any) => {
                      // console.log(data);
                    },
                    (error: HttpErrorResponse) => {
                      alert(error);
                    }
                  );
                });
              }

              if (this.retaggedVendorsWithReason.length > 0) {
                this.retaggedVendorsWithReason.forEach((object) => {
                  this.vendorService.deleteRetaggedVendors(object).subscribe(
                    (data: any) => {
                      // console.log(data);
                    },
                    (error: HttpErrorResponse) => {
                      alert(error);
                    }
                  );
                });
              }
              this.projectEditable = false;
              this.reasonToDetagDialog = false;
              this.sourceProducts = [];
              this.targetProducts = [];
              // this.deleteBusinessOwner();

              this.ngOnInit();

              // to make selectedFiles1 variable as null
              this.myInputVariable.nativeElement.value = '';
              this.files = { ...this.selectedFiles1?.item(0) };
              this.files = null;
            },
            (error: HttpErrorResponse) => {
              if (error.status === 406) {
                this.messageService.add({
                  severity: 'info',
                  summary: 'error..!!',
                  detail: 'Duplicate values not allowed',
                });
                this.spinner.isLoading.next(false);
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'error...!!',
                  detail: 'Something went wrong, please try again',
                });
                this.spinner.isLoading.next(false);
              }
            }
          );
      },

      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Project not updated',
        });
      },
    });
  }

  deleteBusinessOwner() {
    for (let i = 0; i < this.businessOwnerId.length; i++) {
      this.vendorService.deleteBusinessOwner(this.businessOwnerId[i]).subscribe(
        (data: any) => {
          // console.log(this.businessOwnerId[i], ' Deleted...........!!!');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Business User deleted successfully..!! ',
          });
        },
        (error: HttpErrorResponse) => {
          // console.log('error...........!!!');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong , please try again...!!',
          });
        }
      );
    }
  }

  deleteProject() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Project?',
      accept: () => {
        for (let id of this.selectedId) {
          this.vendorService.deleteProject(id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Project deleted successfully',
              });
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Error',
                detail: 'Something went wrong while deliting vendor',
              });
            }
          );
        }
        this.selectedId = [];
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Project not deleted',
        });
      },
    });
  }

  SaveDraftProjectForm1() {
    this.messageService.add({
      severity: 'info',
      summary: 'Saved',
      detail: 'Saved as Draft ',
    });
    // console.log(this.clientForm1.value);
  }
  SaveDraftProjectForm2() {
    this.messageService.add({
      severity: 'info',
      summary: 'Saved',
      detail: 'Saved as Draft ',
    });
    // console.log(this.clientForm1.value);
  }
  SaveDraftProjectForm3() {
    this.messageService.add({
      severity: 'info',
      summary: 'Saved',
      detail: 'Saved as Draft ',
    });
    // console.log(this.clientForm1.value);
  }

  // trial

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      firstname: new FormControl('', [
        Validators.required,
        Validators.pattern(this.firstNamePattern),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern(this.lastNamePattern),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      id: new FormControl(''),
    });
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }

  businessOwnerId: any[] = [];
  removeSkill(i: any) {
    // console.log(i, '././././');

    this.businessOwnerId.push(i);
    this.skills.removeAt(i);
    // console.log(this.businessOwnerId, 'id......!');
  }

  removeSkill1(i: any) {
    // console.log(i, 'data to be removed');

    this.skills.removeAt(i);
    // console.log(i);
  }

  reasonForDetag!: string;
  reasonToDetagDialog: boolean = false;
  detaggedVendors: any[] = [];
  onClickMoveToSource(event: any) {
    this.detagVendorsWithReason = [];
    this.detaggedVendors = [];
    this.taggedVendors = [];
    this.reasonForDetag = '';

    // console.log(event.items);

    // for (let i = 0; i < event.items.length; i++) {
    //   let itemPresent = false; // Flag to check if item is present in allScoredVendors array

    //   for (let j = 0; j < this.allScoredVendors.length; j++) {
    //     if (
    //       event.items[i].vendorName ===
    //       this.allScoredVendors[j].vendorObject.vendorName
    //     ) {
    //       itemPresent = true;
    //       this.detaggedVendors.push(event.items[i]);
    //       this.reasonToDetagDialog = true;
    //       break; // Exit the inner loop since item is found
    //     }
    //   }

    //   if (!itemPresent) {
    //     this.detaggedVendors.push(event.items[i]);
    //   }
    // }

    for (let i = 0; i < event.items.length; i++) {
      this.detaggedVendors.push(event.items[i]);
      this.reasonToDetagDialog = true;
    }
  }


  detagVendorsWithReason: any[] = [];
  onClickOk() {
    this.detaggedVendors.forEach((data) => {
      let object = {
        vendorName: data.vendorName,
        reason: this.reasonForDetag,
        projectId: this.newprojectData.projectId,
        detaggedBy: sessionStorage.getItem('email'),
      };

      const vendorExist = this.detagVendorsWithReason.find(
        (item: any) =>
          item.vendorName === object.vendorName &&
          item.projectId === object.projectId
      );

      if (!vendorExist) {
        this.detagVendorsWithReason.push(object);
      }
    });

    // console.log('detagVendorsWithReason: ', this.detagVendorsWithReason);

    this.reasonToDetagDialog = false;
  }

  taggedVendors: any[] = [];
  retaggedVendorsWithReason: any[] = [];
  onClickMoveToTarget(event: any) {
    this.detagVendorsWithReason = [];
    this.taggedVendors = [];
    this.detaggedVendors = [];
    event.items.forEach((vendor: any) => {
      let object = {
        vendorName: vendor.vendorName,
        projectId: this.newprojectData.projectId,
      };
      this.taggedVendors.push(object);
    });

    this.vendorService
      .getDetaggedVendors(this.newprojectData.projectId)
      .subscribe((data: any) => {
        // console.log('data affter tagged: ', data);

        data.forEach((object: any) => {
          this.taggedVendors.forEach((object1: any) => {
            if (object1.vendorName === object.vendorName) {
              this.retaggedVendorsWithReason.push(object.id);
            }
          });
        });
        // console.log('this.taggedVendors: ', this.taggedVendors);
        // console.log(
        //   'detagVendorsWithReason in tagged: ',
        //   this.detagVendorsWithReason
        // );
        // console.log(
        //   'retaggedVendorsWithReason in tagged: ',
        //   this.retaggedVendorsWithReason
        // );
      });
  }

  onClickCancelDetagDialog() {
    this.detaggedVendors.forEach((vendor: any) => {
      this.sourceProducts.pop(vendor);
      this.targetProducts.push(vendor);

      this.sourceProducts = [...this.sourceProducts];
      this.targetProducts = [...this.targetProducts];
    });
    this.reasonToDetagDialog = false;
  }
}
