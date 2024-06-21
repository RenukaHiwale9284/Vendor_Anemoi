import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { TreeSelect } from 'primeng/treeselect';
import { TemplatebuilderService } from 'src/app/templatebuilder.service';
import { Product } from './model/Product';

@Component({
  selector: 'app-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.css'],
  providers: [MessageService],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `,
  ],
})
export class TemplateBuilderComponent implements OnInit {
  products1: Product[] | undefined;

  savebtn: boolean = false;

  selectedNode: any;
  nodes1!: any[];

  //items: MenuItem[] | undefined;

  items!: MenuItem[];

  products2: Product[] = [];

  statuses!: SelectItem[];

  criteria!: SelectItem[];

  category!: SelectItem[];
  newstatuses!: any[];
  countries: any[]=[];
  selectedCity1!:string;
  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private messageService: MessageService,
    private templateService: TemplatebuilderService
  ) {}

  ngOnInit(): void {
    this.newRow();
    this.countries = [
      {
          name: 'Category',
          id: 'c1',
          states: [
              {name: 'Organisation Profile'},
              {name: 'IT Infrastructure Services'},
              {name: 'Service level Agreement'},
              {name: 'Transition Approach'},
              {name: 'Adherence to Regulations/Standard and Compliance'},
              {name: 'Continuous Improvement'},
              {name: 'Commercial Evaluation'},
              {name: 'Organisation Profile'},
              {name: 'Experience and Customer References'},
              {name: 'Commercial Evaluation (Security - 5 Year)'},
              {name: 'Commercial Evaluation (Infra- 5 Year)'},
              {name: 'Security Services Offerings (On Going) & IT SOC Service Offering (One Time)'}
          ]
      },
      {
          name: 'Subcategory', 
          id: 'sc1',
          states: [
              {name: 'Servers support'},
              {name: 'Network services support'},
              {name: 'For O365/M365 services support'},
              {name: 'For Cloud Infrastructure support'},
              {name: 'Proposed Geographical distribution of Manpower'},
              {name: 'Compliant to Clients current technology landscape'},
              {name: 'Approach and Methodology'},
              {name: 'Exceptions'},
              {name: 'Offering NG SIEM'},
              {name: 'Offering User and Entity Behavior Analytics (UEBA )'},
              {name: 'Offering Threat prevention/detection services'},
              
          ]
      },
      {
          name: 'Parameter',
          code: 'p1',
          states: [
              {name: 'Service Desk'},
              {name: 'Incident management'},
              {name: 'Problem management'},
              {name: 'Asset and configuration management (IMAC)'},
              {name: 'Availability Management'},
              {name: 'Monitoring Management'},
              {name: 'Capacity Management'},
              {name: 'Backup Management'},
              {name: 'Security Management'},
              {name: 'Customer Relationship Management'},
              {name: 'Vendor Management'},
              {name: 'Disaster Recovery Support'}
          ]
      }
   ];


    this.templateService.getCategoryDropdown().subscribe(
      (data: any) => {
        this.nodes1 = data.map((categoryDropdown: any) => {
          return {
            label: categoryDropdown.label,
          };
        });

        console.log('yoyo', this.nodes1);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );

    //useable
    this.templateService.getProduct().subscribe(
      (data: any) => {
       // this.products2 = data;
        console.log('data is:', this.products2);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
    this.statuses = [
      { label: 'Service Desk', value: 'Service Desk' },
      { label: 'Incident management', value: 'Incident management' },
      { label: 'Problem management', value: 'Problem management' },
      {
        label: 'Asset and configuration management',
        value: 'Asset and configuration management',
      },
      { label: 'Availability Management', value: 'Availability Management' },
    ];

    //used for scoring criteria
    this.criteria = [
      { label: 'Free scoring', value: 'Free scoring' },
      { label: 'Criteria 2.4.1.1', value: 'Criteria 2.4.1.1' },
      { label: 'Criteria 2.4.1.2', value: 'Criteria 2.4.1.2' },
      { label: 'Criteria 2.4.1.3', value: 'Criteria 2.4.1.3' },
      { label: 'Criteria 2.4.1.4', value: 'Criteria 2.4.1.4' },
    ];

    //used for category options
    this.category = [
      { label: 'Organisation Profile', value: 'Organisation Profile' },
      {
        label: 'IT Infrastructure Services',
        value: 'IT Infrastructure Services',
      },
      {
        label:
          'Security Services Offerings (On Going) & IT SOC Service Offering (One Time)',
        value:
          'Security Services Offerings (On Going) & IT SOC Service Offering (One Time)',
      },
      { label: 'Service level Agreement', value: 'Service level Agreement' },
      { label: 'Transition Approach', value: 'Transition Approach' },
      {
        label: 'Adherence to Regulations/Standard and Compliance',
        value: 'Adherence to Regulations/Standard and Compliance',
      },
      { label: 'Continuous Improvement', value: 'Continuous Improvement' },
      { label: 'Commercial Evaluation', value: 'Commercial Evaluation' },
      {
        label: 'Experience and Customer References',
        value: 'Experience and Customer References',
      },
      {
        label: 'Commercial Evaluation (Security - 5 Year)',
        value: 'Commercial Evaluation (Security - 5 Year)',
      },
      {
        label: 'Commercial Evaluation (Infra- 5 Year)',
        value: 'Commercial Evaluation (Infra- 5 Year)',
      },
    ];

    //used for options curently not in use
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {},
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {},
          },
        ],
      },
    ];

    this.newstatuses = [
      {
        label: 'Category',
        data: 'Documents Folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [
          {
            label: 'Organisation Profile',
            value: 'Organisation Profile',
          },
          {
            label: 'IT Infrastructure Services',
            data: 'PrimeFaces Logo',
          },
          {
            label:
              'Security Services Offerings (On Going) & IT SOC Service Offering (One Time) ',
            data: 'PrimeUI Logo',
          },
          {
            label: 'Service level Agreement',
            data: 'Barcelona Photo',
          },
          {
            label: 'Transition Approach',
            data: 'Barcelona Photo',
          },
          {
            label: 'Adherence to Regulations/Standard and Compliance',
            data: 'Barcelona Photo',
          },
          {
            label: 'Continuous Improvement',
            data: 'Barcelona Photo',
          },
          {
            label: 'Commercial Evaluation',
            data: 'Barcelona Photo',
          },
          {
            label: 'Organisation Profile',
            data: 'Barcelona Photo',
          },
          {
            label: 'Experience and Customer References',
            data: 'Barcelona Photo',
          },
          {
            label: 'Commercial Evaluation (Security - 5 Year)',
            data: 'Barcelona Photo',
          },
          {
            label: 'Commercial Evaluation (Infra- 5 Year)',
            data: 'Barcelona Photo',
          },
        ],
      },
    ];
  }

  newRow() {
    // return { brand: '', color: '', vin: '', year: '' };

    this.savebtn = true;

    return {
      id: '',
      category: '',
      subcategory: '',
      parameter: '',
      weightage: '',
      maxschore: '',
      schoringcriteria: '',
    };
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = { ...product };
  }

  selectedCountry: any;
  handleFromCountry() {
    this.selectedCountry = this.selectedNode.label;
  }

  //edit the row
  onRowEditSave(product: Product) {
    console.log('new row', product);

    // product.inventoryStatus = this.selectedCountry;

    this.templateService.updateProduct(product).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product is updated',
        });
        console.log('mydate', data);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong data is not going');
      }
    );
  }

  //delete the row

  onRowDelete(product: { id: any }) {
    const id = product.id;

    this.templateService.deleteProduct(id).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product is updated',
        });

        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  //save the row
  onRowAddSave(product: Product) {
    console.log('new row', product);

    this.templateService.addProduct(product).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product Added successfully',
        });
        console.log('mydate', data);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong data is not going');
      }
    );
  }

  //copy the row

  onRowcpySave(product: { id: string }) {
    product.id = '_' + Math.random().toString(36).substr(2, 9);
    console.log(product);

    this.templateService.copyProduct(product).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product is updated',
        });

        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  //move parameter as new category

  onRowmoveAsNewCat(product: any) {
    const prod = product;

    // const newcat = prod.parameter;

    this.shivUpdate(product);

    prod.category = prod.category;
    prod.subcategory = prod.subcategory;
    prod.parameter = prod.parameter;
    prod.weightage = '';
    prod.maxschore = '';
    prod.schoringcriteria = '';

    this.onRowcpySave(prod);
  }

  shivUpdate(product: any) {
    const newprod = product;

    newprod.parameter = '';
    newprod.weightage = '';
    newprod.maxschore = '';
    newprod.schoringcriteria = '';
    this.onRowEditSave(newprod);
  }

  hello() {
    alert('i have clicked move as new caetgory');
  }

  onRowEditCancel(product: any, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    delete this.products2[product.id];
  }
}
