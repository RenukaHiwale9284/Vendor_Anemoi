import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AppModuleConstants } from 'src/app/app-constants';

import { AppComponent } from 'src/app/app.component';

import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';

import { environment } from 'src/environments/environment';

import jwt_decode from 'jwt-decode';
import { AuthserviceService } from './authservice.service';
import * as CryptoJS from 'crypto-js';
import * as CircularJSON from 'circular-json';
export interface encreptedDataObject {
  encreptedData?: any;
}

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  project: FormGroup;

  data: any;

  ref: any;

  allUserData: any;
  newEncryptedObject!: encreptedDataObject;
  encryptUserData: any;
  allDecryptedemailData: any;
  extractedrolenames: any;
  extracteduserstatus: any;
  extractedemail: any;
  extractedlastname: any;
  extractedfirstname: any;
  mainPage: boolean = true;
  loginEmailId:any;
  constructor(
    private router: Router,

    private route: ActivatedRoute,

    private vendorService: VendorMngServiceService,

    private loginService: AuthserviceService,

    private http: HttpClient
  ) {
    this.project = new FormGroup({
      username: new FormControl('', Validators.required), // password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): any {
    this.route.queryParams.subscribe((params) => {
      this.ref = params['ref'];
    });

  //   if (
  //     window.location.href != '' &&
  //     window.location.href.indexOf('code') >= 0
  //   ) {
  //     this.mainPage = false;
  //     const code = new URL(window.location.href).searchParams.get('code');

  //     this.getAccessToken(code);

  //     return true;
  //   }
  // }

  // intialMethod(): any {
  //   if (
  //     window.location.href != '' &&
  //     window.location.href.indexOf('code') >= 0
  //   ) {
  //     const code = new URL(window.location.href).searchParams.get('code');

  //     this.getAccessToken(code);

  //     return true;
  //   } else {
  //     window.location.href =
  //       environment.login_url +
  //       '?response_type=' +
  //       environment.reponse_type +
  //       '&client_id=' +
  //       environment.client_id +
  //       '&redirect_uri=' +
  //       environment.redirect_url +
  //       '&scope=' +
  //       environment.scope;
  //   }
  }

  getAccessToken(code: any) {
    // console.log('code: ', code);

    const body = new HttpParams()

      .set('code', code)

      .set('redirect_uri', environment.redirect_url)

      .set('grant_type', environment.grant_type)

      .set('client_id', environment.client_id)

      .set('client_secret', environment.secret);

    let headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencode; charset=utf-8',
    });

    return this.http.post(environment.access_token, body).subscribe(
      (data) => {
        console.log('data 1:', data);

        this.getUserInfo(data);

        // debugger;
      },

      (error) => {
        alert('error while getting userinfo');
      }
    );
  }
  private environment = {
    cIter: 1000,
    kSize: 128,
    kSeparator: '::',
    val1: 'abcd65443A',
    val2: 'AbCd124_09876',
    val3: 'sa2@3456s',
  };
  getUserInfo(data: any) {
    console.log('userinfo..: ', data);

    // this.allUserData = this.getDecodedAccessToken(data.id_token);
    // console.log('allUserData: ', this.allUserData);

    //encryptedt code
    const jsonString = JSON.stringify(data);
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const key = CryptoJS.PBKDF2(
      `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
      CryptoJS.enc.Hex.parse(salt),
      {
        keySize: this.environment.kSize / 32,
        iterations: this.environment.cIter,
      }
    );
    console.log('key ###', key);
    console.log('jsonString ###', jsonString);
    let cText = CryptoJS.AES.encrypt(jsonString, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    console.log('key ###', key);
    console.log('Iv ###', iv);
    console.log('salt ###', salt);

    let aesText =
      iv +
      this.environment.kSeparator +
      salt +
      this.environment.kSeparator +
      cText.ciphertext.toString(CryptoJS.enc.Base64);
    let aesFinalText = btoa(aesText);
    console.log('aesText: ', aesFinalText);

    this.newEncryptedObject = {};

    this.newEncryptedObject.encreptedData = aesFinalText;
    this.encryptUserData = aesFinalText;
    console.log('email string data', this.encryptUserData);

    this.loginService.getuserInfo(this.encryptUserData).subscribe(
      (data1: any) => {
        const base64EncodedData = data1;
        const decodedData = atob(base64EncodedData);
        console.log(decodedData, 'decode data');
        let toArray = decodedData.split(this.environment.kSeparator);
        console.log(toArray, 'array');

        const key = CryptoJS.PBKDF2(
          `${this.environment.val1}${this.environment.val2}${this.environment.val3}`,
          CryptoJS.enc.Hex.parse(toArray[1]),
          {
            keySize: this.environment.kSize / 32,
            iterations: this.environment.cIter,
          }
        );
        let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(toArray[2]),
        });
        console.log(key, 'key');
        const _iv = toArray[0];
        let cText1 = CryptoJS.AES.decrypt(cipherParams, key, {
          iv: CryptoJS.enc.Hex.parse(_iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        try {
          // debugger
          const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
          // const decryptedObject = JSON.parse(decryptedString);
          console.log(decryptedString, 'decrypted object');
          const userDataString = decryptedString;

          //role seperate

          const roleNameMatch = userDataString.match(/roleName=([^,]*)/);
          if (roleNameMatch && roleNameMatch.length > 1) {
            const roleName = roleNameMatch[1];
            this.extractedrolenames = roleName;
            console.log('User Role Name:', this.extractedrolenames);
          } else {
            console.error('Role Name not found in the provided data.');
          }

          //email seperate

          const emailMatch = userDataString.match(/email=([^,]*)/);
          if (emailMatch && emailMatch.length > 1) {
            const email = emailMatch[1];
            this.extractedemail = email;
            console.log('User Email:', this.extractedemail);
            // this.allDecryptedemailData = email
          } else {
            console.error('Email not found in the provided data.');
          }

          //status seperate
          const userStatusMatch = userDataString.match(/userStatus=([^,]*)/);
          if (userStatusMatch && userStatusMatch.length > 1) {
            const userStatus = userStatusMatch[1];
            this.extracteduserstatus = userStatus;
            console.log('User Status:', userStatus);
          } else {
            console.error('User Status not found in the provided data.');
          }

          //first name seperate

          const firstNameMatch = userDataString.match(/firstName=([^,]*)/);
          if (firstNameMatch && firstNameMatch.length > 1) {
            const firstName = firstNameMatch[1];
            this.extractedfirstname = firstName;
            console.log('User First Name:', firstName);
          } else {
            console.error('First Name not found in the provided data.');
          }

          // last name seperate
          const lastNameMatch = userDataString.match(/lastName=([^,]*)/);
          if (lastNameMatch && lastNameMatch.length > 1) {
            const lastName = lastNameMatch[1];
            this.extractedlastname = lastName;

            console.log('User Last Name:', lastName);
          } else {
            console.error('Last Name not found in the provided data.');
          }
        } catch (error) {
          console.error('Error parsing decrypted data as JSON:', error);
        }

        const data = this.allDecryptedemailData;
        console.log(data, 'role');

        if (
          this.extractedrolenames === 'Admin' &&
          this.extracteduserstatus === 'Active'
        ) {
          sessionStorage.setItem(
            AppModuleConstants.USER,
            this.extractedfirstname
          );
          sessionStorage.setItem(
            AppModuleConstants.LASTNAME,
            this.extractedlastname
          );
          sessionStorage.setItem(AppModuleConstants.ROLE, '1');
          sessionStorage.setItem(AppModuleConstants.EMAIL, this.extractedemail);
          sessionStorage.setItem(
            AppModuleConstants.USERNAME,
            this.extractedemail
          );
          this.router.navigate(['/Admin']);
        } else if (
          this.extractedrolenames === 'Business User' &&
          this.extracteduserstatus === 'Active'
        ) {
          sessionStorage.setItem(
            AppModuleConstants.USER,
            this.extractedfirstname
          );
          sessionStorage.setItem(
            AppModuleConstants.LASTNAME,
            this.extractedlastname
          );
          sessionStorage.setItem(AppModuleConstants.ROLE, '2');
          sessionStorage.setItem(AppModuleConstants.EMAIL, this.extractedemail);
          sessionStorage.setItem(
            AppModuleConstants.USERNAME,
            this.extractedemail
          );
          this.router.navigate(['/BusinessUser']);
        } else if (
          this.extractedrolenames === 'Client User' &&
          this.extracteduserstatus === 'Active'
        ) {
          sessionStorage.setItem(
            AppModuleConstants.USER,
            this.extractedfirstname
          );
          sessionStorage.setItem(
            AppModuleConstants.LASTNAME,
            this.extractedlastname
          );
          sessionStorage.setItem(AppModuleConstants.ROLE, '3');
          sessionStorage.setItem(AppModuleConstants.EMAIL, this.extractedemail);
          sessionStorage.setItem(
            AppModuleConstants.USERNAME,
            this.extractedemail
          );
          this.router.navigate(['/ClientUser']);
        } else {
          alert('User is Inactive or Invalid Credentials..!!');

          // window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
        }
      },

      (error: HttpErrorResponse) => {
        alert('User is Inactive or Invalid Credentials..!!');
        console.log('error: ', error);
        // window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
        // window.location.href="https://ipzjlvwvaswv001.pwcglb.com/";
      }
    );

    var accessToken = data.access_token;

    var idToken = data.idToken;

    sessionStorage.setItem('access_token', accessToken);

    return this.http

      .get(
        environment.user_info +
          '?access_token=' +
          accessToken +
          '&redirect_uri=' +
          environment.redirect_url
      )

      .subscribe((userInfo) => {
        // console.log('userinfo1: ', userInfo);

        var checkUserInfo = userInfo;
      });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  // ////////////////////////////////////////////////

  checked: boolean = false;
  dialog: boolean = false;

  onClickTandC() {
    this.dialog = true;
  }

  onClickLogin() {
    if (this.checked) {
      // this.intialMethod();
    } else {
      alert('please accept terms and conditions');
    }
  }
}
