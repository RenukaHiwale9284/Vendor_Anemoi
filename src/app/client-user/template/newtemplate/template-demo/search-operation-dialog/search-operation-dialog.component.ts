import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { TemplatebuilderService } from '../../templatebuilder.service';

@Component({
  selector: 'app-search-operation-dialog',
  templateUrl: './search-operation-dialog.component.html',
  styleUrls: ['./search-operation-dialog.component.css']
})
export class SearchOperationDialogComponent implements OnInit {

  searchForm!: FormGroup;
  selectedType: any;
  fieldValue!: any[];
  filteredOptions?: Observable<any>;

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
        this.selectedType = 'sc2';
        break;
      case 'subCategoryThree':
        this.selectedType = 'sc3';
        break;
      case 'parameter':
        this.selectedType = 'p1';
        break;
    }

    this.searchForm = this.fb.group({
      type: [this.selectedType, Validators.required],
      fieldName: ['', Validators.required]
    });

    this.onOptionSelect(this.selectedType);
  }

  onSubmit(): void {

    this.templateService.emitDialogFormData({
      fieldValue: this.searchForm.get('fieldName')?.value,
      action: 'search',
      meta: this.data.meta,
      operation: this.data.operation
    });
  }

  onOptionSelect(type: number) {
    this.searchForm.get('fieldName')?.patchValue('');
    let fieldValue: any[] = [];

    this.data.categoriesData.forEach((data: any, index: number) => {
      data.states.forEach((element: any) => {
        fieldValue.push(element);
      })
    });
    this.fieldValue = fieldValue;

    this.filteredOptions = this.searchForm.get('fieldName')?.valueChanges.pipe(
      startWith(''),
      map(value => (this._filter(value || '')),
      ));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.fieldValue.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
