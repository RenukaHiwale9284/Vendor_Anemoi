import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatebuilderService } from '../../templatebuilder.service';
import { LibraryService } from 'src/app/services/library.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';

@Component({
  selector: 'app-edit-operation-dialog',
  templateUrl: './edit-operation-dialog.component.html',
  styleUrls: ['./edit-operation-dialog.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class EditOperationDialogComponent implements OnInit {
  editForm!: FormGroup;
  selectedType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private templateService: TemplatebuilderService,
    private masterRepoService: LibraryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

    private spinner: LoadingSpinnerService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    switch (this.data.operation) {
      case 'category':
        this.selectedType = 'c1';
        break;
      case 'subCategory':
        this.selectedType = 'sc1';
        break;
      case 'subCategoryTwo':
        this.selectedType = 'sc1';
        break;
      case 'subCategoryThree':
        this.selectedType = 'sc1';
        break;
      case 'parameter':
        this.selectedType = 'p1';
        break;
    }

    this.editForm = this.fb.group({
      type: [this.selectedType, Validators.required],
      fieldValue: ['', Validators.required],
    });
  }

  onClickSaveCustomvalue() {
    let fieldvalueName2 = {
      value: '',
      type: '',
    };
    let fieldvalueName1 = {
      value: '',
      type: '',
    };
    let fieldvalueName3 = {
      value: '',
      type: '',
    };
    console.log(this.editForm.value, 'Category.....');
    if (this.editForm.value.type == 'c1') {
      fieldvalueName1 = {
        value: this.editForm.value.fieldValue,
        type: 'Category',
      };
      this.masterRepoService.addCategory(fieldvalueName1).subscribe(
        (data1: any) => {
          
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Line item added as category',
          });
          setTimeout(() => {
            this.masterRepoService.getCategories().subscribe((data1: any) => {
              console.log(data1, 'data./....');
              this.transformCategoryData1(data1);
            });
              
          }, 1300);

          
          console.log(data1, 'data');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 406) {
            this.messageService.add({
              severity: 'warn',
              summary: 'error...!!',
              detail: 'Line Item already present',
            });
            this.spinner.isLoading.next(false);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'error...!!',
              detail: 'Something went wrong, please try again',
            });
          }
        }
      );
    } else if (this.editForm.value.type == 'sc1') {
      fieldvalueName2 = {
        value: this.editForm.value.fieldValue,
        type: 'Subcategory',
      };

      this.masterRepoService.addCategory(fieldvalueName2).subscribe(
        (data2: any) => {
          this.masterRepoService.getCategories().subscribe((data2: any) => {
            console.log(data2, 'data./....');
            this.transformCategoryData1(data2);
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Line item added as subcategory',
          });
          console.log(data2, 'data');
        },

        (error: HttpErrorResponse) => {
          if (error.status === 406) {
            this.messageService.add({
              severity: 'warn',
              summary: 'error...!!',
              detail: 'Line Item already present',
            });
            this.spinner.isLoading.next(false);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'error...!!',
              detail: 'Something went wrong, please try again',
            });
          }
        }
      );
    } else if (this.editForm.value.type == 'p1') {
      fieldvalueName3 = {
        value: this.editForm.value.fieldValue,
        type: 'Parameter',
      };

      this.masterRepoService.addCategory(fieldvalueName3).subscribe(
        (data3: any) => {
          this.masterRepoService.getCategories().subscribe((data3: any) => {
            console.log(data3, 'data./....');
            this.transformCategoryData1(data3);
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Line item added as parameter',
          });
          console.log(data3, 'data');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 406) {
            this.messageService.add({
              severity: 'warn',
              summary: 'error...!!',
              detail: 'Line Item already present',
            });
            this.spinner.isLoading.next(false);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'error...!!',
              detail: 'Something went wrong, please try again',
            });
          }
        }
      );
    }
    // console.log(fieldvalueName1,'fieldvalueName1');
    // console.log(fieldvalueName2,'fieldvalueName2');
    // console.log(fieldvalueName2,'fieldvalueName3');
  }
  categoryNames: any[] = [];
  categoryNames1: any[] = [];
  categoryNames2: any[] = [];
  categoriesData: any[] = [];
  categoriesData1: any[] = [];

  transformCategoryData1(inputData: any) {
    this.categoriesData = [];
    // console.log(inputData, 'inputData1');
    for (let i = 0; inputData.length; i++) {
      console.log(inputData[i], 'inputData1');
      if (inputData[i].type === 'Category') {
        const categoryName1 = {
          categoryName: inputData[i].value,
        };
        this.categoryNames.push(categoryName1);

        // console.log(this.categoryNames,'categoriesData1 ......');
      } else if (inputData[i].type === 'Subcategory') {
        const categoryName2 = {
          categoryName: inputData[i].value,
        };
        this.categoryNames1.push(categoryName2);

        // console.log(this.categoryNames1,'categoriesData2 ......');
      } else if (inputData[i].type === 'Parameter') {
        const categoryName3 = {
          categoryName: inputData[i].value,
        };
        this.categoryNames2.push(categoryName3);

        // console.log(this.categoryNames1,'categoriesData2 ......');
      }
    }
  }

  onSubmit(): void {
    let type = this.editForm.get('type')?.value;
    let fieldValue = this.editForm.get('fieldValue')?.value;

    this.data.categoriesData.forEach((data: any, index: number) => {
      if (data.id == type) {
        this.data.categoriesData[index].states.push({
          name: fieldValue,
        });
        console.log(
          this.data.categoriesData[index].states,
          'this.data.categoriesData[index].states'
        );
      }
    });

    this.templateService.emitDialogFormData({
      fieldValue: fieldValue,
      action: 'edit',
      meta: this.data.meta,
      operation: this.data.operation,
    });
  }
}
