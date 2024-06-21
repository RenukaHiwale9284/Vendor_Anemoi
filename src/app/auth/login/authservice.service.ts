import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${environment.url}/login`, data, {});
  }

  getuserInfo(email: string) {
    console.log(email,'encrypted email in service');
    
    return this.http.get(`${environment.url}/users/email/${email}`,{
      responseType:'json'
    });
  }
}
