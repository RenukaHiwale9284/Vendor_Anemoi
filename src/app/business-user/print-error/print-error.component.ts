import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-error',
  templateUrl: './print-error.component.html',
  styleUrls: ['./print-error.component.css']
})
export class PrintErrorComponent implements OnInit {

  @Input("descriptionControl")
  descriptionControl: any;

  @Input("roleControl")
  roleControl: any;

  // @Input("firstnameControl")
  // firstname: any;

  @Input("fieldName")
  roleName: any;
  
  @Input("vendorNameControl")
  vendorNameControl: any;

  @Input("spocName")
  spocName: any;
  
  @Input("email")
  email: any;
  
  @Input("contactNumberControl")
  contactNumberControl: any;
  
  @Input("firstName")
  firstName: any;

  @Input("vendorTemplateAccess")
  vendorTemplateAccess: any;


  @Input("clientName")
  clientName: any;

  @Input("projectName")
  projectName: any;

  @Input("projectCode")
  projectCode: any;

  @Input("rfpName")
  rfpName: any;

  @Input("description")
  description: any;

  @Input("name")
  name: any;

  constructor() { }

  ngOnInit(): void {
  }

}
