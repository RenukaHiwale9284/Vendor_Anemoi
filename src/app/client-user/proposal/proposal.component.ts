import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppModuleConstants } from 'src/app/app-constants';
import { TemplateService } from 'src/app/client-user/template/template.service';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Proposal } from './proposal.interface';
import { ProposalService } from './proposal.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposalDetails: Proposal[] = [];
  scorecards: any[] = [];
  sectorOptions: any[] = [
    { name: 'Sample Sector', code: 1 },
    { name: 'Sample Sector 1', code: 2 },
  ];
  selectedSector!: number;

  viewOptions: any[] = [{ name: 'Proposal', code: 1 }];
  selectedView!: number;
  userRole!: string;
  userName!: string;
  projects:any;
  selectedProject!: string;
  allDecryptedData:any
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
    private service: ProposalService,
    private templateService: TemplateService,
    private vendorService:VendorMngServiceService
  ) {}

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    // to fetch all template details
    this.vendorService.getTemplateDetailsByUser(this.userName).subscribe(
      (data: any) => {
        this.proposalDetails = data;
        // console.log('hello', this.proposalDetails);
      },
      (error: HttpErrorResponse) => {}
    );

// to fetch all score cards
    this.service.getscoreCards().subscribe(
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
          // console.log(decryptedObject, 'decrypted object');
        } catch (error) {
          // console.error('Error parsing decrypted data as JSON:', error);
        }
        this.scorecards = this.allDecryptedData;
        // console.log('all scorecards', this.scorecards);
      },
      (error: HttpErrorResponse) => {}
    );
    // this.service.getProposalDetails().subscribe((data: any) => {

    //   this.proposalDetails = data;
    //   console.log("hello", this.proposalDetails);
    // }, (error: HttpErrorResponse) => {

    // });
  }

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  getStatusClass(status: any) {
    // console.log('status: ', status);
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

  navigateProposalDetails(scorecardId: any) {
    // console.log("scorecardId: ",scorecardId);
    
    // this.router.navigate(['/BusinessUser/proposal-list/' + projectId]);
  }

  navigateScorcardDetails(scoreCardId: any) {
    this.router.navigate(['/BusinessUser/scorcard/' + scoreCardId]);
  }
}
