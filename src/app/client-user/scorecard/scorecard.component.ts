import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ScorecardService } from './scorecard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css'],
})
export class ScorecardComponent implements OnInit {
  scorecards: any;
  allData: any[] = [];
  projectList1: any[] = [];

  projects: any;
  selectedProject!: string;

  currentRoute:any;
  allDecryptedData:any
  allDecryptedprojectData:any 
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };
  constructor(
    private service: ScorecardService,
    private router: Router,
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
    if(this.currentRoute.includes('score')){
      this.userService.activeNavIcon('proposal');
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
        // console.log(this.projects, 'projects');

        // console.log(this.projects);
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
    this.service.getScorecards().subscribe(
      (data: any) => {
        const base64EncodedData = data;
        const decodedData = atob(base64EncodedData);
        // const decodedData = CryptoJS.enc.Base64.parse(base64EncodedData).toString(CryptoJS.enc.Utf8);
        // console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        // console.log(toArray, 'split array');

        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(toArray[1]),
          {
            keySize: this.environment.kSize / 32,
            iterations: this.environment.cIter
          }
        );
        let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(toArray[2])
        });
        console.log(key, 'key');

        
         const _iv = toArray[0]
        let cText1 = CryptoJS.AES.decrypt(
          cipherParams,
          key,
          {
            iv: CryptoJS.enc.Hex.parse(_iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );
       
        // console.log( cText1.toString(CryptoJS.enc.Utf8),'decrypt data');


        try {
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          const decryptedObject = JSON.parse(decryptedString);
          this.allDecryptedData =decryptedObject
          console.log(this.allDecryptedData, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        // this.scorecards = data;
        // console.log(this.scorecards, ' all scorecards');
        this.scorecards = this.transformTempalteClientuserData(this.allDecryptedData);
        this.projectList1 = this.transformDraftProjectList(this.scorecards);
        this.scorecards.reverse();
        // console.log("without reverse: ",this.scorecards);
        // console.log("with reverse:",this.scorecards.reverse());
      },
      (error: any) => {
        alert('something went wrong while getting all scorecards');
      }
    );
  }

  transformTempalteClientuserData(inputData: any) {
    this.allData = [];
    const allDataSet = new Set();
    
    inputData.forEach((data: any) => {
        for (let i = 0; i < data.projectData.businessUser.length; i++) {
            if (data.projectData.businessUser[i] === sessionStorage.getItem('email')) {
                allDataSet.add(data);
                break; // Exit the loop after adding the data once
            }
        }
    });
    
    this.allData = Array.from(allDataSet);
    const transformedData = this.transformScorecardByVendor(this.allData);
    
    return transformedData;
    // return categoryData4;
  }

  transformScorecardByVendor(inputData: any) {
    // console.log("scorecards for logged in users:",inputData);
    
    let scorecardDataByVendor = inputData.filter((data: any) => {
      // console.log('draft data????????????', data);
      if (
        data.projectData.selectedVendors?.includes(data.vendorObject.vendorName)
      ) {
        return data;
      }
    });
    // console.log("scorecardDataByVendor: ",scorecardDataByVendor);
    
    return scorecardDataByVendor;
  }

  transformDraftProjectList(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('all project data????????????', data);

        return data.projectData.projectName;
      })
      .map((data: any) => {
        return { projectName: data.projectData.projectName };
      });
    projectData = Array.from(
      new Set(projectData.map((data: any) => JSON.stringify(data)))
    ).map((data: any) => JSON.parse(data));

    projectData.sort((a: any, b: any) => {
      const nameA = a.projectName.toLowerCase();
      const nameB = b.projectName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return projectData;
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

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  navigateTemplateDetails(scorecardId: any) {
    // console.log('scorecardId: ', scorecardId);
    this.router.navigate(['/ClientUser/scorcard/' + scorecardId]);
  }
}
