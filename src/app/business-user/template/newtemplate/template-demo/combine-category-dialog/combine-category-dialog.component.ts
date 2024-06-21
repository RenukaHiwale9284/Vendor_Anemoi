import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatebuilderService } from '../../templatebuilder.service';

@Component({
  selector: 'app-combine-category-dialog',
  templateUrl: './combine-category-dialog.component.html',
  styleUrls: ['./combine-category-dialog.component.css']
})
export class CombineCategoryDialogComponent implements OnInit {

  combineDataForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private templateService: TemplatebuilderService) { }

  ngOnInit(): void {
    this.combineDataForm = this.fb.group({
      fieldName: ['', Validators.required]
    });
  }

  onSubmit(): void {

    console.log('dailog this.data: ', this.data);
    let selectedValue = this.combineDataForm.get('fieldName')?.value;

    let eventData = {
      categoryIndex: this.data.input.categoryIndex,
      subCategoryIndex: this.data.input.subCategoryIndex,
      subCategoryTwoIndex: this.data.input.subCategoryTwoIndex,
      subCategoryThreeIndex: this.data.input.subCategoryThreeIndex,
      parameterIndex: this.data.input.parameterIndex,
      operation: this.data.input.operation,
      selectedIndex: null,
      selectedCategoryIndex: null,
      selectedSubCategoryIndex: null,
      selectedSubCategoryTwoIndex: null,
      selectedSubCategoryThreeIndex: null
    };

    switch (this.data.input.operation) {
      case 'category':
        this.data.input.originalData.forEach((element: any, index: any) => {
          if (element.name == selectedValue) {
            eventData.selectedIndex = index;
            return;
          }
        });
        break;
      case 'subCategory':
        this.data.input.originalData.forEach((category: any, categoryIndex: any) => {
          category.subcategory.forEach((subCategory: any, subCategoryIndex: any) => {
            if (subCategory.subcategoryname == selectedValue) {
              eventData.selectedIndex = subCategoryIndex;
              eventData.selectedCategoryIndex = categoryIndex;
              return;
            }
          });
        });
        break;
      case 'subCategoryTwo':
        this.data.input.originalData.forEach((category: any, categoryIndex: any) => {
          category.subcategory.forEach((subCategory: any, subCategoryIndex: any) => {
            subCategory.subcategoryTwo.forEach((subCategoryTwo: any, subCategoryTwoIndex: any) => {
              if (subCategoryTwo.subcategoryname == selectedValue) {
                eventData.selectedIndex = subCategoryTwoIndex;
                eventData.selectedCategoryIndex = categoryIndex;
                eventData.selectedSubCategoryIndex = subCategoryIndex;
                return;
              }
            });
          });
        });
        break;
      case 'subCategoryThree':
        this.data.input.originalData.forEach((category: any, categoryIndex: any) => {
          category.subcategory.forEach((subCategory: any, subCategoryIndex: any) => {
            subCategory.subcategoryTwo.forEach((subCategoryTwo: any, subCategoryTwoIndex: any) => {
              subCategoryTwo.subcategoryThree.forEach((subCategoryThree: any, subCategoryThreeIndex: any) => {
                if (subCategoryThree.subcategoryname == selectedValue) {
                  eventData.selectedIndex = subCategoryThreeIndex;
                  eventData.selectedCategoryIndex = categoryIndex;
                  eventData.selectedSubCategoryIndex = subCategoryIndex;
                  eventData.selectedSubCategoryTwoIndex = subCategoryTwoIndex;
                  return;
                }
              });
            });
          });
        });
        break;
      case 'parameter':
        this.data.input.originalData.forEach((category: any, categoryIndex: any) => {
          category.subcategory.forEach((subCategory: any, subCategoryIndex: any) => {
            subCategory.subcategoryTwo.forEach((subCategoryTwo: any, subCategoryTwoIndex: any) => {
              subCategoryTwo.subcategoryThree.forEach((subCategoryThree: any, subCategoryThreeIndex: any) => {
                subCategoryThree.parameter.forEach((parameter: any, parameterIndex: any) => {
                  if (subCategoryThree.subcategoryname == selectedValue) {
                    eventData.selectedIndex = parameterIndex;
                    eventData.selectedCategoryIndex = categoryIndex;
                    eventData.selectedSubCategoryIndex = subCategoryIndex;
                    eventData.selectedSubCategoryTwoIndex = subCategoryTwoIndex;
                    eventData.selectedSubCategoryThreeIndex = subCategoryThreeIndex;
                    return;
                  }
                });
              });
            });
          });
        });
        break;

    }
    console.log('selectedIndex: ', eventData.selectedIndex);

    this.templateService.emitDialogFormData({
      eventData: eventData,
      action: 'combine'
    });
  }



}
