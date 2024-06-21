import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Template } from './model/template';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TemplateDetailsComponent implements OnInit {

  index: number = 0;
  templateForm!: FormGroup;

  templateData!: Template;
  constructor(private router:Router, private service: VendorMngServiceService,private messageService: MessageService,private confirmationService: ConfirmationService ) { }

  ngOnInit(): void {
    this.templateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      createdOn: new FormControl(''),
      createdBy:new FormControl('Shivraj Godle')
    });


    
  }

  openNext() {
    debugger
    this.templateForm.value.createdOn=Date.now();

    this.service.templateDescriptionData = this.templateForm.value;
    console.log(this.service.templateDescriptionData,"this.service.templateDescriptionData");
    
    this.router.navigate(['/nav/newtemplate/tableDemo']); 
  }
  
  onSaveDraft(){  
    this.templateForm.value.createdOn=Date.now();

    this.service.templateDescriptionData = this.templateForm.value;
    this.router.navigate(['/nav/newtemplate/tableDemo']);
    // this.service.addTemplateDetails(this.templateForm.value).subscribe(
    //   (data:any)=>{
    //     console.log(data, " Added successfully");
    //     this.ngOnInit();
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successfull',
    //       detail: 'Role addedd successfully',
    //     });
        
    //   },
    //   (error:HttpErrorResponse)=>{
    //     this.messageService.add({
    //       severity: 'Danger',
    //       summary: 'Error',
    //       detail: 'Something went wrong while adding user..!!',
    //     });
    //   }
    // )
    console.log("template data",this.templateForm.value);
    
  }

}
