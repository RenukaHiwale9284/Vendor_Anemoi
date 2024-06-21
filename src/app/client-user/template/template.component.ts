import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Template } from './newtemplate/template-details/model/template';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  templateDetails: Template[] = [];
  allData: any[] = [];
  projects:any;
  selectedProject!: string;
  projectList1:any[]=[];

  currentRoute:any;
  allDecryptedprojectData:any;
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };
  constructor(
    private router: Router,
    private service: VendorMngServiceService,
    private projectService: ProjectService,
    private userService:UserService
  ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute=this.router.url
      }
    });

  }
  ngOnInit(): void {
    if(this.currentRoute.includes('template') || this.currentRoute.includes('ClientUser')){
      this.userService.activeNavIcon('template');
    }

    
    this.projectService.getClients().subscribe(
      (data: any) => {
        console.log(data,'encrypted data');
        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(toArray[1]),
          {
            keySize: this.environment.kSize / 32,
            iterations: this.environment.cIter
          }
        ); let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
        });
        console.log(key, 'key'); const _iv = toArray[0]
        let cText1 = CryptoJS.AES.decrypt(
          cipherParams,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(_iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        ); try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedprojectData =decryptedObject
          console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        this.projects = this.allDecryptedprojectData;
         for (let i = 0; i < this.projects.length; i++) {
          this.projects = this.projects.sort((a: any, b: any) => {
            if (a.projectName < b.projectName) return -1;
            if (a.projectName > b.projectName) return 1;
            return 0;
          });
        }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
    
    this.service.getTemplateDetails().subscribe(
      (data: any) => {
        // this.templateDetails = data;
       
        this.templateDetails =this.transformTempalteClientuserData(data).reverse();
        this.projectList1 = this.transformDraftProjectList(
          this.templateDetails      
        );
        // console.log( this.templateDetails ,' this.templateDetails...  ');
      },
      (error: HttpErrorResponse) => {
        window.location.reload();

      }
    );
  }


  transformTempalteClientuserData(inputData: any) {
    this.allData = [];
    const allDataSet = new Set();
    
    inputData.forEach((data: any) => {
        for (let i = 0; i < data.project.businessUser.length; i++) {
            if (data.project.businessUser[i] === sessionStorage.getItem('email')) {
                allDataSet.add(data);
                break; // Exit the loop after adding the data once
            }
        }
    });
    
    this.allData = Array.from(allDataSet);
    return this.allData;
    
  }


  transformDraftProjectList(inputData: any) {
    
    
    let projectData = inputData
      .filter((data: any) => {
        // console.log('all project data????????????', data);

        return data.project.projectName;
      })
      .map((data: any) => {
        return { projectName: data.project.projectName };
      });
      projectData = Array.from(new Set(projectData.map((data: any) => JSON.stringify(data))))
      .map((data: any) => JSON.parse(data));

      projectData.sort((a:any, b:any) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

    return projectData;
  }





  onClickAddTemplate() {
    this.router.navigate(['/ClientUser/create-template']);
  }

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  getStatusClass(status: any) {
    switch (status) {
      case 'Pending':
        return 'status-badge status-badge-pending';
        break;
      case 'In Progress':
        return 'status-badge status-badge-progress';
      case 'Done':
        return 'status-badge status-badge-success';
    }
    return '';
  }

  navigateTemplateDetails(templateId: any) {
    this.service.templateDetails = this.templateDetails.filter((data: any) => {
      return data.templateId == templateId;
    });
    // console.log('TD: ', this.service.templateDetails);
    // console.log('this.service.templateDetails: ', this.service.templateDetails);
    this.router.navigate(['/ClientUser/template-list/' + templateId]);
  }
}
