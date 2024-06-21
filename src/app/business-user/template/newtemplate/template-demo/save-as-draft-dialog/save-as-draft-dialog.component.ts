import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { TemplatebuilderService } from '../../templatebuilder.service';

@Component({
  selector: 'app-save-as-draft-dialog',
  templateUrl: './save-as-draft-dialog.component.html',
  styleUrls: ['./save-as-draft-dialog.component.css']
})
export class SaveAsDraftDialogComponent implements OnInit, OnDestroy {
  saveAsDraftForm!: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private templateService: TemplatebuilderService,
    private vendorService: VendorMngServiceService) { }

  ngOnInit(): void {

    this.saveAsDraftForm = this.fb.group({
      draftVerion: new FormControl('', Validators.required),
      draftTag: new FormControl('', Validators.required)
    });

  }

  onSubmit() {
    console.log('this.saveAsDraftForm.value: ', this.saveAsDraftForm.value);
    this.templateService.emitDialogFormData({
      saveAsDraftForm: this.saveAsDraftForm.value,
      action: 'draft'
    });
  }

  ngOnDestroy() {
    this.templateService.dialogFormDataObserver.unsubscribe();
    console.log(this.templateService.dialogFormDataObserver, 'Destroyed');
  }

}
