import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatebuilderService } from '../../templatebuilder.service';

@Component({
  selector: 'app-edit-operation-dialog',
  templateUrl: './edit-operation-dialog.component.html',
  styleUrls: ['./edit-operation-dialog.component.css']
})
export class EditOperationDialogComponent implements OnInit {

  editForm!: FormGroup;
  selectedType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private templateService: TemplatebuilderService) { }

  ngOnInit(): void {
    // console.log(this.data)
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
      fieldValue: ['', Validators.required]
    });
  }

  onSubmit(): void {
    let type = this.editForm.get('type')?.value;
    let fieldValue = this.editForm.get('fieldValue')?.value;

    this.data.categoriesData.forEach((data: any, index: number) => {
      if (data.id == type) {
        this.data.categoriesData[index].states.push({
          name: fieldValue
        });
      }
    });

    this.templateService.emitDialogFormData({
      fieldValue: fieldValue,
      action: 'edit',
      meta: this.data.meta,
      operation: this.data.operation
    });
  }
}
