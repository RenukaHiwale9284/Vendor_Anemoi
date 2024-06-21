import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Role } from '../role/model/role';
import { User, Manager } from './model/user';
import { NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';

export interface encreptedDataObject {
  encreptedData?: any;
}

export interface encrytdata {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  role: string;
  manager: string;
  partner: string;
  userStatus: string;
  createdOn: string;
  createdBy: string;
  editedBy: string;
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UserComponent implements OnInit {
  addUserDialogBox: boolean = false;
  editUserDialog: boolean = false;
  uploadDialog: boolean = false;
  checked!: boolean;

  userForm!: FormGroup;
  allUsers: any[] = [];
  userData!: User;

  roles: Role[] = [];
  encryptUser: encrytdata[] = [];
  roles1: any[] = [];
  managers: Manager[] = [];
  partners: Manager[] = [];

  selectedFiles?: FileList;
  selectedRole!: Role;
  selectedManager!: string;
  selectedPartner!: string;
  selectedAccess1: string[] = [];
  selectedAccess2: string[] = [];
  selectedAccess3: string[] = [];
  selectedUser: any[] = [];

  first2: number = 0;
  rows2: number = 10;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
];


  access1: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Download' },
    { access: 'Comment' },
  ];

  access2: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Download' },
    { access: 'Comment' },
  ];

  access3: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Approve Request' },
  ];

  firstNamePattern = '^[a-zA-Z ]{3,155}$';
  lastNamePattern = '^[a-zA-Z ]{3,155}$';
  // pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  mobnumPattern = '^((\\+91-?)|0)?[5,6,7,8,9]{1}[0-9]{9}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';
  managerpattern = '[^<>]*$';
  partnerpattern = '[^<>]*';

  userId!: string;
  userFormEditable: boolean = false;
  before!: boolean;
  isLoading: boolean = false;
  newEncryptedObject!: encreptedDataObject;
  currentRoute: any;
  constructor(
    private vendorService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current route in user:', this.router.url);
        this.currentRoute = this.router.url;
      }
    });

    // this.roles = [
    //   { role: 'Super Admin' },
    //   { role: 'Admin' },
    //   { role: 'client' },
    //   { role: 'Business User' },
    // ];

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
  }

  currentTime!: Date;
  intervalId: any;
  allDecryptedData:any
  ngOnInit(): void {
    console.log('currentRoute: ', this.currentRoute);

    if (this.currentRoute.includes('user')) {
      this.userService.activeNavIcon('user');
    }

    // this.intervalId = setInterval(() => {
    //   this.currentTime = new Date();
    //   console.log(this.currentTime);

    // }, 1000); // Update every 1 second

    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    for (let i = 0; i < this.roles1.length; i++) {
      this.roles1 = this.roles1.sort((a: any, b: any) => {
        if (a.role < b.role) return -1;
        if (a.role > b.role) return 1;
        return 0;
      });
    }

    this.spinner.isLoading.next(true);

    this.userForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.firstNamePattern),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.lastNamePattern),
      ]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.mobnumPattern),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      role: new FormControl(''),
      manager: new FormControl('',[Validators.required,Validators.pattern(this.managerpattern)]),
      partner: new FormControl('',[Validators.required,Validators.pattern(this.partnerpattern)]),
      userStatus: new FormControl(''),
      createdOn: new FormControl(''),
      createdBy: new FormControl(''),
      editedBy: new FormControl(''),
    });

    // to fetch all roles

    this.roleService.getRoles().subscribe(
      (data: any) => {
        this.before = true;
        this.roles1 = [];
        this.getActiveRoles(data);
        this.before = false;
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // to fetch all users
    this.vendorService.getuUser().subscribe(
      (data: any) => {
        // console.log(data, 'encrypted data');
        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        // const decodedData = CryptoJS.enc.Base64.parse(base64EncodedData).toString(CryptoJS.enc.Utf8);
        // console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        // console.log(toArray, 'split array');

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
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedData =decryptedObject
          // console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
       
        this.allUsers =  this.allDecryptedData;
        // console.log(data, ' all Users');
        this.allUsers.reverse();
        // console.log(this.allUsers, ' all Users');
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  getActiveRoles(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].roleStatus === 'Active') {
        const activeRoles = data[i];
        this.roles1.push(activeRoles);
      } else {
        this.roles1 = [];
      }
    }
  }

  onClickAddUser() {
    this.checked = true;
    this.addUserDialogBox = true;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  userPostencryptedData: any[] = [];
  encryptUserData: any
  private secretKey = '1234567890123456';

  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };



  






  onClickSave() {
    if (this.checked) {
      this.userForm.value.userStatus = 'Active';
    } else {
      this.userForm.value.userStatus = 'Inactive';
    }

    // get role by roleName

    this.roleService.getRoleByName(this.userForm.value.role).subscribe(
      (data: any) => {
        console.log(data, ' get role by rolename');

        this.userForm.value.role = data;
        this.userForm.value.editedBy = sessionStorage.getItem('email');
        this.userForm.value.createdBy = sessionStorage.getItem('email');
        // const kSize =256
        const jsonString = JSON.stringify(this.userForm.value);
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
        // const keySize1 = 128 / 32;
        const passPhrase = 'anemoi';


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
        console.log('string data', this.encryptUserData);






        this.vendorService.addUser(this.newEncryptedObject, this.secretKey).subscribe(
          (data: any) => {
            this.addUserDialogBox = false;

            this.spinner.isLoading.next(true);
            // console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'user addedd successfully',
            });

            this.userForm.reset();
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            if (error.status === 406) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Email or Mobile number should not be duplicate',
              });
              this.spinner.isLoading.next(false);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'error..!!',
                detail: 'Something went wrong, please try again',
              });
              this.spinner.isLoading.next(false);

              this.addUserDialogBox = false;
              this.ngOnInit();
            }
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // this.userForm.value.userStatus = this.checked;
    // console.log(this.userForm.value, ' all data to be post');
  }

  onClickUpdate() {
    this.userForm.value.editedBy = sessionStorage.getItem('email');

    // console.log(JSON.stringify(this.userForm.value), ' data to be updated');

    // this.userData.status = this.checked;
    if (this.checked) {
      this.userForm.value.userStatus = 'Active';
    } else {
      this.userForm.value.userStatus = 'Inactive';
    }
    this.roleService
      .getRoleByName(this.userForm.value.role)
      .subscribe((data: any) => {
        this.userForm.value.role = data;
        this.confirmationService.confirm({
          message: 'Are you sure that you want to edit this user?',
          accept: () => {
            this.spinner.isLoading.next(true);
            this.addUserDialogBox = false;
            this.vendorService
              .updateUser(this.userForm.value, this.userId)
              .subscribe(
                (data: any) => {
                  // console.log('User Updated' + data);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'user updated Successfully',
                  });
                  this.spinner.isLoading.next(false);

                  this.userForm.reset();
                  this.ngOnInit();
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 500) {
                    this.messageService.add({
                      severity: 'warn',
                      summary: 'Warning',
                      detail: 'Email or Mobile number shuould be duplicate',
                    });
                    this.spinner.isLoading.next(false);
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'error..!!',
                      detail: 'Something went wrong, please try again..!!',
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
              detail: 'user not updated',
            });
          },
        });
      });
  }

  onClickCancle() {
    this.userFormEditable = false;
    this.addUserDialogBox = false;
    this.editUserDialog = false;
    this.uploadDialog = false;
    this.userForm.reset();
  }

  editUser(user: any) {
    // this.vendorService.getUserById(id).subscribe(
    //   (data: any) => {


        this.userData = user;
        console.log(this.userData, ' user data by id');

        if (this.userData.userStatus === 'Active') {
          this.checked = true;
        } else {
          this.checked = false;
        }

        this.userId = this.userData.id;
        this.userForm.get('firstName')?.patchValue(this.userData.firstName);
        this.userForm.get('lastName')?.patchValue(this.userData.lastName);
        this.userForm
          .get('mobileNumber')
          ?.patchValue(this.userData.mobileNumber);
        this.userForm.get('email')?.patchValue(this.userData.email);
        this.userForm.get('role')?.patchValue(this.userData.role.roleName);
        // this.selectedRole=this.userData.role;
        this.userForm.get('manager')?.patchValue(this.userData.manager);
        this.userForm.get('partner')?.patchValue(this.userData.partner);
        this.userForm.get('userStatus')?.patchValue(this.userData.userStatus);
        this.userForm.get('createdOn')?.patchValue(this.userData.createdOn);
        this.userForm.get('createdBy')?.patchValue(this.userData.createdBy);
        this.userForm
          .get('editedBy')
          ?.patchValue(sessionStorage.getItem('email'));
        this.userFormEditable = true;

        this.addUserDialogBox = true;
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.messageService.add({
    //       severity: 'Danger',
    //       summary: 'Error',
    //       detail: 'Something went wrong while adding user..!!',
    //     });
    //   }
    // );
  }

  deleteUser() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete User?',
      accept: () => {
        for (let user of this.selectedUser) {
          this.vendorService.deleteUser(user.id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'user deleted successfully',
              });
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'Danger',
                summary: 'Error',
                detail: 'Something went wrong while deleting user..!!',
              });
            }
          );
        }
        this.selectedUser = [];
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'user not deleted',
        });
      },
    });
  }

  uploadUsers() {
    this.uploadDialog = true;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    alert('file uploaded successfully');
    this.uploadDialog = false;
  }

  roleSelection() {
    // alert(this.selectedRole)
  }

  getStatusClass(status: any) {
    // console.log('status: ', status);
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
        break;
      case 'Inactive':
        return 'status-badge status-badge-pending';
    }
    return '';
  }

  currentPage:any;
  onPageChange2(event:any) {
    this.first2 = event.first;
    this.rows2 = event.rows;
}
}
