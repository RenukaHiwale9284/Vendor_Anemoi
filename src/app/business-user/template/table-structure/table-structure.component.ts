import { Component, OnInit } from '@angular/core';
import { TemplatebuilderService } from '../newtemplate/templatebuilder.service';
import { Template } from './model/template';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-table-structure',
  templateUrl: './table-structure.component.html',
  styleUrls: ['./table-structure.component.css'],
})
export class TableStructureComponent implements OnInit {
  products: any[] = [];
  countries: any[] = [];
  product1!: Template;
  currentRoute: any;

  constructor(
    private templateService: TemplatebuilderService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute=this.router.url
      }
    });
  }

  ngOnInit(): void {
    
    if(this.currentRoute.includes('template')){
      this.userService.activeNavIcon('template');
    }
    this.countries = [
      {
        name: 'Category',
        id: 'c1',
        states: [
          { name: 'Organisation Profile' },
          { name: 'IT Infrastructure Services' },
          { name: 'Service level Agreement' },
          { name: 'Transition Approach' },
          { name: 'Adherence to Regulations/Standard and Compliance' },
          { name: 'Continuous Improvement' },
          { name: 'Commercial Evaluation' },
          { name: 'Organisation Profile' },
          { name: 'Experience and Customer References' },
          { name: 'Commercial Evaluation (Security - 5 Year)' },
          { name: 'Commercial Evaluation (Infra- 5 Year)' },
          {
            name: 'Security Services Offerings (On Going) & IT SOC Service Offering (One Time)',
          },
        ],
      },
      {
        name: 'Subcategory',
        id: 'sc1',
        states: [
          { name: 'Servers support' },
          { name: 'Network services support' },
          { name: 'For O365/M365 services support' },
          { name: 'For Cloud Infrastructure support' },
          { name: 'Proposed Geographical distribution of Manpower' },
          { name: 'Compliant to Clients current technology landscape' },
          { name: 'Approach and Methodology' },
          { name: 'Exceptions' },
          { name: 'Offering NG SIEM' },
          { name: 'Offering User and Entity Behavior Analytics (UEBA )' },
          { name: 'Offering Threat prevention/detection services' },
        ],
      },
      {
        name: 'Parameter',
        code: 'p1',
        states: [
          { name: 'Service Desk' },
          { name: 'Incident management' },
          { name: 'Problem management' },
          { name: 'Asset and configuration management (IMAC)' },
          { name: 'Availability Management' },
          { name: 'Monitoring Management' },
          { name: 'Capacity Management' },
          { name: 'Backup Management' },
          { name: 'Security Management' },
          { name: 'Customer Relationship Management' },
          { name: 'Vendor Management' },
          { name: 'Disaster Recovery Support' },
        ],
      },
    ];
  }

  newRow() {
    return {
      id: '',
      category: '',
      cat_wightage: '',
      subcategory1: '',
      sc1_weightage: '',
      subcategory2: '',
      sc2_weightage: '',
      subcategory3: '',
      sc3_weightage: '',
      parameter: '',
      p_weightage: '',
      maxScore: '',
      scoringCriteria: '',
    };
  }

  onSelect() {
    console.log(this.products[0].category);
  }

  //copy the row

  onRowcpySave(product: { id: string }) {
    product.id = '_' + Math.random().toString(36).substr(2, 9);
    console.log(product);

    this.templateService.copyProduct(product).subscribe(
      (data: any) => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Product is updated',
        // });

        this.ngOnInit();
      },
      (error: any) => {
        alert('something went wrong');
      }
    );
  }
}
