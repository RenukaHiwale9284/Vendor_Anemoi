import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { RoleService } from 'src/app/services/role.service';
import { User } from '../user/model/user';
import { Role } from './model/role';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RoleComponent implements OnInit {
  addRoleDialogBox: boolean = false;
  editRoleDialog: boolean = false;
  uploadDialog: boolean = false;
  viewUser: boolean = false;
  viewRoles: boolean = false;
  checked!: boolean;
  roleForm!: FormGroup;
  allRoles: any[] = [];
  roleData!: Role;
  userData: User[] = [];
  roles: Role[] = [];
  roleName!: string;
  selectedFiles?: FileList;
  selectedRole!: string;
  isLoading: boolean = false;

  selectedAccess1: string[] = [];
  selectedAccess2: string[] = [];
  selectedAccess3: string[] = [];
  selectedId: string[] = [];

  roleId!: string;

  currentRoute:any;

  access1: any[] = [
    { access: 'Comment' },
    { access: 'Download' },
    { access: 'Edit' },
    { access: 'View' },
  ];

  access2: any[] = [
    { access: 'Comment' },
    { access: 'Download' },
    { access: 'Edit' },
    { access: 'View' },
  ];

  access3: any[] = [
    { access: 'Approve Request' },
    { access: 'Edit' },
    { access: 'View' },
  ];

  descriptionPattern = '^([a-zA-Z0-9 .,]{3,200})$';
  roleNamePattern = '^([a-zA-Z ]{3,200})$';

  constructor(
    private vendorService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current route in user:', this.router.url);
        this.currentRoute=this.router.url
      }
    });
  }

  ngOnInit(): void {




    const myHeaders = new Headers();

    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.spinner.isLoading.next(true);
    // this.checked = true;
    this.viewRoles = true;
    this.roleForm = new FormGroup({
      roleName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.roleNamePattern),
      ]),
      descriptions: new FormControl('', [
        Validators.required,
        Validators.pattern(this.descriptionPattern),
      ]),
      vendorTemplateAccess: new FormControl('', Validators.required),
      dashboardAccess: new FormControl('', Validators.required),
      masterRepoAccess: new FormControl('', Validators.required),
      // createdOn: new FormControl(''),
      roleStatus: new FormControl(''),
      createdOn: new FormControl(''),
    });

    // to fetch all roles
    this.vendorService.getuRole().subscribe(
      (data: any) => {
        this.allRoles = data;
        this.allRoles.reverse();
        // this.roleForm;
        // console.log(this.allRoles);
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        window.location.reload();
      }
    );
  }

  onClickCheckBox() {
    // console.log(this.selectedId);
  }

  onClickAddRole() {
    this.checked = true;
    this.addRoleDialogBox = true;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }
  editHandleChange(e: any) {
    this.roleData.checked = e.checked;
  }

  onClickSave() {
    this.spinner.isLoading.next(true);

    if (this.checked) {
      this.roleForm.value.roleStatus = 'Active';
    } else {
      this.roleForm.value.roleStatus = 'Inactive';
    }

    // console.log(this.roleForm.value, ' roledata to be post');

    this.vendorService.addRole(this.roleForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Role addedd successfully',
        });
        // console.log(JSON.stringify(data));

        this.addRoleDialogBox = false;
        this.roleForm.reset();
        this.ngOnInit();
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 406) {
          this.messageService.add({
            severity: 'error',
            summary: 'error...!!',
            detail: 'Duplicate Role not Allowed',
          });
          this.addRoleDialogBox = false;
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Unsuccessfullerror',
            detail: 'Something went wrong, please try again',
          });
          this.addRoleDialogBox = false;
          this.spinner.isLoading.next(false);
        }
      }
    );
  }

  onClickUpdate() {
    if (this.checked) {
      this.roleForm.value.roleStatus = 'Active';
    } else {
      this.roleForm.value.roleStatus = 'Inactive';
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Role?',
      accept: () => {
        this.spinner.isLoading.next(true);
        this.addRoleDialogBox = false;

        this.vendorService.updateRole(this.roleForm.value).subscribe(
          (data: any) => {
            // console.log('Role Updated' + data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'role updated Successfully',
            });
            this.spinner.isLoading.next(false);

            this.roleForm.reset();
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            if (error.status === 500) {
              this.messageService.add({
                severity: 'warn',
                summary: 'error..!!',
                detail: 'Duplicate Role not allowed',
              });
              this.spinner.isLoading.next(false);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'error..!!',
                detail: 'Something went wrong, try once again',
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
          detail: 'role not updated',
        });
        this.roleForm.reset();
      },
    });
  }

  onClickCancle() {
    this.roleFormEditable = false;
    this.addRoleDialogBox = false;
    this.editRoleDialog = false;
    this.uploadDialog = false;
    this.roleForm.reset();
    // this.roleData.totalCount = 0;
    // this.roleData.accessCount = '0';
  }

  access12!: any[];
  roleFormEditable: boolean = false;

  // On Click Edit Button
  editRole(data: any) {
    // this.vendorService.getRoleById(id).subscribe(
    //   (data: any) => {
    this.roleData = data;

    if (this.roleData.roleStatus === 'Active') {
      this.checked = true;
    } else {
      this.checked = false;
    }

    // console.log(this.roleData, ' data to be edited');

    // this.roleData.dashboardAccess = this.roleData.dashboardAccess[0]
    //   .substring(1, this.roleData.dashboardAccess[0].length - 1)
    //   .split(',');
    // this.roleData.masterRepoAccess = this.roleData.masterRepoAccess[0]
    //   .substring(1, this.roleData.masterRepoAccess[0].length - 1)
    //   .split(',');
    // this.roleData.vendorTemplateAccess =
    //   this.roleData.vendorTemplateAccess[0]
    //     .substring(1, this.roleData.vendorTemplateAccess[0].length - 1)
    //     .split(',');

    // console.log(this.roleData.dashboardAccess, 'data...');

    // this.roleData.dashboardAccess = this.roleData.dashboardAccess.map(
    //   (element: any) => {
    //     return element.trim();
    //   }
    // );
    // this.roleData.masterRepoAccess = this.roleData.masterRepoAccess.map(
    //   (element: any) => {
    //     return element.trim();
    //   }
    // );
    // this.roleData.vendorTemplateAccess =
    //   this.roleData.vendorTemplateAccess.map((element: any) => {
    //     return element.trim();
    //   });

    this.roleId = this.roleData.roleId;
    this.roleForm.get('roleName')?.patchValue(this.roleData.roleName);
    this.roleForm.get('descriptions')?.patchValue(this.roleData.descriptions);
    this.roleForm
      .get('dashboardAccess')
      ?.patchValue(this.roleData.dashboardAccess);
    this.roleForm
      .get('vendorTemplateAccess')
      ?.patchValue(this.roleData.vendorTemplateAccess);
    this.roleForm
      .get('masterRepoAccess')
      ?.patchValue(this.roleData.masterRepoAccess);
    this.roleForm.get('roleStatus')?.patchValue(this.roleData.roleStatus);
    this.roleForm.get('createdOn')?.patchValue(this.roleData.createdOn);
    this.roleFormEditable = true;
    this.addRoleDialogBox = true;
    //   },
    //   (error: HttpErrorResponse) => {
    //     alert(error);
    //   }
    // );
  }

  deleteRole() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected roles?',
      accept: () => {
        for (let id of this.selectedId) {
          this.vendorService.deleteRole(id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Role deleted successfully',
              });
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'danger',
                summary: 'Error',
                detail: 'Something went wrong while deleting role..!!',
              });
              this.ngOnInit();
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
          detail: 'role not deleted',
        });
      },
    });
  }

  uploadRoles() {
    this.uploadDialog = true;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    alert('file uploaded successfully');
    this.uploadDialog = false;
  }

  onClickEye(roleName: string) {
    // console.log(roleName);
    this.addRoleDialogBox = false;
    this.viewRoles = false;
    this.spinner.isLoading.next(true);

    this.vendorService.getuserByroleName(roleName).subscribe(
      (data: any) => {
        this.userData = data;
        this.roleName = roleName;
        // console.log(this.userData);
        this.viewUser = true;

        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert(error);
        this.spinner.isLoading.next(false);
      }
    );
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

  onClickBack() {
    this.addRoleDialogBox = false;
    this.viewUser = false;
    this.viewRoles = true;
  }
}
