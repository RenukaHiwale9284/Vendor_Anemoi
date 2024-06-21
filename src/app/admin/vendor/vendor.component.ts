import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { VendorService } from 'src/app/services/vendor.service';
import { lineOfBusiness, Vendor } from './model/vendor';
import { ProjectService } from 'src/app/services/project.service';
import { LibraryService } from 'src/app/services/library.service';
import { UserService } from 'src/app/services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';

export interface encreptedDataObject {
  encreptedData?: any;
}
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class VendorComponent implements OnInit {
  addVendorDialogBox: boolean = false;
  editVendorDialog: boolean = false;
  checked: boolean = true;
  vendorForm!: FormGroup;
  addlineOfBusinessForm!: FormGroup;
  allVendors: any[] = [];
  vendorData!: Vendor;

  allLineOfBusiness: any[] = [];

  selectedFiles?: FileList;
  selectedLineOfBusiness!: string;
  selectedId: string[] = [];

  vendorNamePattern = '^([0-9a-zA-Z!@#$%^&*()_+ -]{3,155})$';
  spocNamePattern = '^([a-zA-Z ]{3,200})$';
  mobnumPattern = '^((\\+?)|0)?[0-9]{3,20}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';
  lineOfBusinessPattern ='[^<>]*'

  allDecryptedvendorData: any
  vendorId!: string;
  editVendorForm: boolean = false;
  projects: any;
  updateButton: boolean = false;
  save: boolean = false;
  update: boolean = false;
  isLoading: boolean = false;
  flagAdding: boolean = false;
  newEncryptedObject!: encreptedDataObject;
  encryptUserData: any
  currentRoute: any;
  constructor(
    private vendorService: VendorService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private masterRepoService: LibraryService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });

    masterRepoService.getCategories().subscribe((data: any) => {
      //  console.log(data,'data./....');
      this.allLineOfBusiness = this.transformlineofBusiness(data);
    });
  }

  ngOnInit(): void {
    if (this.currentRoute.includes('vendors')) {
      this.userService.activeNavIcon('vendors');
    }

    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.spinner.isLoading.next(true);

    // this.allLineOfBusiness = [
    //   { businessName: 'Hospitality ' },
    //   { businessName: 'IT' },
    //   { businessName: 'Logistics ' },
    //   { businessName: 'Manufacturing' },
    //   { businessName: 'Real Estate' },
    //   { businessName: 'Retailing' },
    // ];

    this.addlineOfBusinessForm = new FormGroup({
      lineOfBusiness: new FormControl('', [Validators.required,Validators.pattern(this.lineOfBusinessPattern)]),
    });

    this.vendorForm = new FormGroup({
      vendorName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.vendorNamePattern),
      ]),
      spocName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.spocNamePattern),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.mobnumPattern),
      ]),
      lineOfBusiness: new FormControl(''),
      createdBy: new FormControl(''),
      modifiedBy: new FormControl(''),
      createdOn: new FormControl(''),
      // createdOn: new FormControl(''),
      // projectId: new FormControl('',[Validators.required]),
    });

    // to fetch all users
    this.vendorService.getVendors().subscribe(
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

        console.log(cText1,'cetext1');
        
        try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedvendorData = decryptedObject
          console.log(this.allDecryptedvendorData, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }


        // this.allVendors = this.allDecryptedvendorData;
        this.allVendors = this.allDecryptedvendorData;
        this.allVendors.reverse();
        // console.log(this.allVendors);
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
        this.spinner.isLoading.next(false);
      }
    );

    //get projects
    this.projectService.getClients().subscribe(
      (data: any) => {
        this.projects = data;
        // this.projects.reverse();
        // console.log(this.projects,'projects');

        // console.log(this.projects);
        for (let i = 0; i < this.projects.length; i++) {
          this.projects = this.projects.sort((a: any, b: any) => {
            if (a.projectName < b.projectName) return -1;
            if (a.projectName > b.projectName) return 1;
            return 0;
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  onClickAddVendor() {
    this.addVendorDialogBox = true;
    this.update = false;
    this.save = true;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };

  onClickSave() {
    // this.vendorForm.value.lineOfBusiness = this.selectedLineOfBusiness;

    // this.vendorService
    //   .addVendor(this.vendorForm.value)
    //   .subscribe((data: any) => {
    //    console.log(data);

    //     if (data.status === 200) {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Successful',
    //         detail: 'Vendor addedd successfully',
    //       });
    //       console.log(data,"response...!!");
    //       this.addVendorDialogBox = false;
    //       this.ngOnInit();
    //     } else if(data.status===404) {
    //       console.log(data,"response...!!");

    //     }
    //     else{
    //       alert("xyz")
    //     }
    //   });

    // this.vendorForm.value.lineOfBusiness = this.selectedLineOfBusiness;

    this.vendorForm.value.createdBy = sessionStorage.getItem('email');
    this.vendorForm.value.modifiedBy = sessionStorage.getItem('email');

    this.addVendorDialogBox = false;
    this.spinner.isLoading.next(true);

    // Encrypted data 
    const jsonString = JSON.stringify(this.vendorForm.value);
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
    console.log('string data', this.encryptUserData);

    this.vendorService.addVendor(this.newEncryptedObject).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Vendor addedd successfully',
        });
        this.spinner.isLoading.next(false);

        this.vendorForm.reset();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.messageService.add({
            severity: 'warn',
            summary: 'warning  ',
            detail: 'Vender already Exist for entered details...!!',
          });
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'error..!!',
            detail: 'Something went wrong, please try again',
          });
          this.spinner.isLoading.next(false);

          this.vendorForm.reset();
          this.ngOnInit();
        }
      }
    );
  }

  onClickUpdate() {
    // console.log(this.vendorData);

    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Vendor?',
      accept: () => {
        this.addVendorDialogBox = false;
        this.spinner.isLoading.next(true);
        this.vendorForm.value.modifiedBy = sessionStorage.getItem('email');

        this.vendorService
          .updateVendor(this.vendorForm.value, this.vendorId)
          .subscribe(
            (data: any) => {
              // console.log('Vendor Updated' + data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Vendor updated Successfully',
              });

              this.spinner.isLoading.next(false);

              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              if (error.status === 500) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Warning',
                  detail: 'Vendor Already Exist for entered details...!!',
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
          detail: 'vendor not updated',
        });
      },
    });
  }

  onClickCancle() {
    this.editVendorForm = false;
    this.addVendorDialogBox = false;
    this.editVendorDialog = false;
    this.updateButton = false;
    this.vendorForm.reset();
  }

  editable: boolean = false;
  editVendor(vendor: any) {
    // this.updateButton=true;
    // console.log(vendor);

    this.vendorService.getVendorById(vendor.vendorId).subscribe(
      (data: any) => {
        this.vendorData = data;
        // console.log(this.vendorData);

        // this.save=false;
        // this.update=true;
        // this.vendorForm.get('vendorName')?.patchValue(this.vendorData.vendorName);
        // this.vendorForm.get('spocName')?.patchValue(this.vendorData.spocName);
        // this.vendorForm.get('email')?.patchValue(this.vendorData.email);
        // this.vendorForm.get('contactNumber')?.patchValue(this.vendorData.contactNumber);
        // this.vendorForm.get('lineOfBusiness')?.patchValue(this.vendorData.lineOfBusiness);

        this.vendorId = this.vendorData.vendorId;
        this.vendorForm
          .get('vendorName')
          ?.patchValue(this.vendorData.vendorName);
        this.vendorForm.get('spocName')?.patchValue(this.vendorData.spocName);
        this.vendorForm.get('email')?.patchValue(this.vendorData.email);
        this.vendorForm
          .get('contactNumber')
          ?.patchValue(this.vendorData.contactNumber);
        this.vendorForm
          .get('lineOfBusiness')
          ?.patchValue(this.vendorData.lineOfBusiness);
        this.vendorForm.get('createdBy')?.patchValue(this.vendorData.createdBy);
        this.vendorForm.get('createdOn')?.patchValue(this.vendorData.createdOn);

        this.editVendorForm = true;
        this.addVendorDialogBox = true;

        if (data.createdBy === sessionStorage.getItem('email')) {
          this.editable = false;
        } else {
          this.editable = true;
        }
        // console.log('vendor data', this.vendorData);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // this.projectService.getProjectById(vendor.projectId).subscribe(
    //   (data:any)=>{
    //     console.log(data,"././././");

    //     this.vendorForm.get('projectId')?.patchValue(data.projectId);
    //   }
    // )
  }

  onClickAddLineOfBusiness() {
    this.flagAdding = true;
  }

  onClickCancle2() {
    this.addlineOfBusinessForm.reset();
  }

  onClickCancelLOB() {
    this.addlineOfBusinessForm.reset();
    this.flagAdding = false;
  }

  onClickSaveLineofBuisnes() {
    // console.log(this.addlineOfBusinessForm.value, 'line Of Business.....');
    const lineofBuisness = {
      value: this.addlineOfBusinessForm.value.lineOfBusiness,
      type: 'Buisness',
    };

    this.flagAdding = false;

    this.masterRepoService.addCategory(lineofBuisness).subscribe(
      (data: any) => {
        this.masterRepoService.getCategories().subscribe(
          (data: any) => {
            //  console.log(data,'data./....');

            // console.log(this.categoriesData, ' data');

            this.allLineOfBusiness = this.transformlineofBusiness(data);

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
          detail: 'Line of Business added',
        });
        // this.spinner.isLoading.next(false);
        // this.categoryForm.reset();
        // this.ngOnInit();
        // console.log(data,'data');
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
  lineofBusinessData: any[] = [];
  // lineofBusinessData1 :any[]=[];
  transformlineofBusiness(inputData: any) {
    const allLineOfBusiness = inputData
      .filter((item: any) => item.type === 'Buisness')
      .map((item: any) => ({ businessName: item.value }))
      .sort((a: any, b: any) => {
        const nameA = a.businessName.toLowerCase();
        const nameB = b.businessName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    return allLineOfBusiness;
  }
  deleteVendor(id: string) {
    //   console.log(id," id to be deleted");

    //   this.confirmationService.confirm({
    //     message: 'Are you sure that you want to Delete this Vendor?',
    //     accept: () => {
    //       this.vendorService.deleteVendor(id).subscribe(
    //         (data: any) => {
    //           this.messageService.add({
    //             severity: 'success',
    //             summary: 'Deleted',
    //             detail: 'Vendor deleted successfully',
    //           });
    //           this.editVendorDialog=false;
    //           this.ngOnInit();
    //         },
    //         (error: HttpErrorResponse) => {
    //           this.messageService.add({
    //             severity: 'danger',
    //             summary: 'Error',
    //             detail: 'Something went wrong while deleting vendor',
    //           });
    //         }
    //       );

    //       this.selectedId = [];
    //       this.ngOnInit();
    //     },
    //     reject: () => {
    //       this.messageService.add({
    //         severity: 'warn',
    //         summary: 'Cancelled',
    //         detail: 'Vendor not deleted',
    //       });
    //     },
    //   });

    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Vendor?',
      accept: () => {
        this.vendorService.deleteVendor(id).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully deleted',
              detail: 'Vendor deleted successfully',
            });
            this.addVendorDialogBox = false;
            this.ngOnInit();
          },
          (error: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'Vendor deleted successfully',
            });
            // this.editVendorDialog = false;
            // this.ngOnInit();
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Vendor not deleted',
        });
      },
    });
  }
}
