import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// import { PublicClientApplication, Configuration,AuthenticationResult  } from '@azure/msal-browser';
@Injectable({
  providedIn: 'root',
})
export class PowerBiService {
  private apiUrl = 'https://api.powerbi.com';
  // private publicClientApplication!: PublicClientApplication;
  response1!: any;
  powerBiToken: any;
  roles: any[] = [];
  datasets: any[] = [];
  constructor(private https: HttpClient, private http: HttpClient) {
    // this.response1 = this.httpClient.post(`https://login.microsoftonline.com/common/oauth2/token`,form);
    // console.log("response1: ",this.response1);
  }
  generateToken(): Observable<any> {
    const formData = new FormData();
    formData.append('client_id', '2e79546a-4556-43a6-a11f-5bb0c884f096');
    formData.append('username', 'ruturaj.gidde@anemoisoftware.com.au');
    formData.append('password', 'Anemoi@2285');
    formData.append(
      'scope',
      'https://analysis.windows.net/powerbi/api/Dashboard.ReadWrite.All'
    );
    formData.append(
      'client_secret',
      '7qI8Q~mGEH62RZ3NvFY2kEvuPBMN5OvC1MUDvdrQ'
    );
    formData.append('grant_type', 'password');
    formData.append('resource', 'https://analysis.windows.net/powerbi/api');

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    console.log(headers, 'headers');
    const powerbi = 'https://login.microsoftonline.com';
    return this.https.post<any>(`${powerbi}/common/oauth2/token`, formData, {
      headers,
    });
  }

  // async getPowerBIAccessToken(): Promise<string> {
  //   const form = {
  //     client_id: '82cc7717-d189-47ef-a563-7af03f6110bb',
  //     username: 'ruturaj.gidde@anemoisoftware.com.au',
  //     password: 'Anemoi@2285',
  //     scope: 'https://analysis.windows.net/powerbi/api/Dashboard.ReadWrite.All',
  //     client_secret: 'M4x8Q~OIcFZ81L_x6~FjNpTEcbHzdwPwsBlcOaYf',
  //     grant_type: 'password',
  //     resource: 'https://analysis.windows.net/powerbi/api',
  //   };

  //   const headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');

  //   const response = this.httpClient.post(`https://login.microsoftonline.com/common/oauth2/token`,form);

  //   const body = response as any;
  //   console.log(body, 'body');

  //   const errorToken = body.error;

  //   if (errorToken) {
  //     throw new Error(errorToken);
  //   }

  //   return body.access_token;
  // }
  // toQueryString(data: any): string {
  //   const queryString = Object.keys(data)
  //     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
  //     .join('&');
  //   return queryString;
  // }

  // getPowerBIAccessTokenWithServicePrincipal(): Observable<any> {
  //   const powerBIConfig = {
  //     Authority: 'https://login.microsoftonline.com/organizations',
  //     Scope: 'https://analysis.windows.net/powerbi/api/.default',
  //     ApplicationId: 'xxxx',
  //     username: 'xxxx',
  //     password: 'xxxxx'
  //   };

  //   return from(this.publicClientApplication.loginPopup({
  //     scopes: [powerBIConfig.Scope]
  //   }))
  //   .pipe(
  //     switchMap((response: any) => {
  //       const secureStringPassword = powerBIConfig.password;

  //       const account = response.account;
  //       if (account) {
  //         return from(this.publicClientApplication.acquireTokenSilent({
  //           scopes: [powerBIConfig.Scope],
  //           account
  //         }));
  //       } else {
  //         return from(this.publicClientApplication.acquireTokenPopup({
  //           scopes: [powerBIConfig.Scope],
  //           loginHint: powerBIConfig.username
  //         }));
  //       }
  //     }),
  //     map((response: AuthenticationResult) => response.accessToken)
  //   );
  // }

  // generatePowerBIEmbedUrl(reportId: string, token: string): string {
  //   const embedUrl = 'https://app.powerbi.com/reportEmbed';
  //   const queryParams = new URLSearchParams({
  //     reportId,
  //     token
  //   }).toString();
  //   return `${embedUrl}?${queryParams}`;
  // }





//power bi service code 

 // To generate access token
 generateTokenFirst(data: any) {
  const url = `${environment.url}/powerBi/access`;
  const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  const body = new HttpParams({ fromObject: data });
  return this.http.post(url, body, { headers, observe: 'response', responseType: 'json' });
}


// To get Embedded URL
getEmbededUrl(reportId: string, tokens: any) {
  sessionStorage.setItem('powerbitoken', tokens);
  const headers = { Auth: `Bearer ${tokens}` };
  return this.http.get(`${environment.url}/powerBi/report/${environment.workSpaceId}/${reportId}`, { headers });
}

 // To generate Embedded token
 embededGenerateToken(data: any, reportId: any,workspaceId:any) {
  console.log("data to be post for embed token: ", data);

  this.roles.push(data.effectiveEntity[0].roles)
  this.datasets.push(data.effectiveEntity[0].datasets)
  const object1 = {
    accessLevel: data.accessLevel,
    allowSaveAs: data.allowSaveAs,
    effectiveEntity: [{
      username: data.effectiveEntity[0].username,
      roles: data.effectiveEntity[0].roles,
      datasets: data.effectiveEntity[0].datasets
    }]
  }

  console.log("object: ",object1);
  

  // console.log("data to be post for embed token after: ", object1);
  const url = `${environment.url}/powerBi/token/${workspaceId}/${reportId}`;
  const headers = { Auth: `Bearer ${sessionStorage.getItem('powerbitoken')}` }
  return this.http.post(url, object1, { headers, observe: 'response', responseType: 'json' });
}

 
}
