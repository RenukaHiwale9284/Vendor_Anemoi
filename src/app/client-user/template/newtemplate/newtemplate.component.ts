import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Template } from './template-details/model/template';
@Component({
  selector: 'app-newtemplate',
  templateUrl: './newtemplate.component.html',
  styleUrls: ['./newtemplate.component.css']
})
export class NewtemplateComponent implements OnInit {

  items!: MenuItem[];
  activeItem!: MenuItem;
  constructor(private service: VendorMngServiceService) { }

  ngOnInit(): void {

    this.items = [
      {label: 'Template Details',routerLink:['/document/nav/newtemplate','templatedetails']},
      // {label: 'Template Builder',routerLink:['/newtemplate','templatebuilder'] },
      // {label: 'Table Structure',routerLink:['/newtemplate','tableStructure'] },
      {label: 'Template Creation',routerLink:['/document/nav/newtemplate','tableDemo'] },
      
  ];
  this.activeItem = this.items[0];



  }


  
  
}
