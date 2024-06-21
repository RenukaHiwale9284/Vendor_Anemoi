import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventHandler } from 'powerbi-client-angular/components/powerbi-embed/powerbi-embed.component';
import { PowerBiService } from 'src/app/services/power-bi.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import * as models from 'powerbi-models';






declare var powerbi: any;
declare var $: any;
interface PowerBiClient {
  models: any;
}
interface WindowWithPowerBiClient extends Window {
  ['powerbi-client']: PowerBiClient;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  currentRoute: any;

  //powerbi variables

  workSpaceId = `${environment.workSpaceId}`;
  reportId = `${environment.reportId}`;
  tenant_id = `${environment.tenant_id}`;
  clientId = `${environment.clientId}`;
  clientSecret = `${environment.clientSecret}`;
  powerbiScope = `${environment.powerbiScope}`;
  username = `${environment.username}`;
  resource = `${environment.resource}`;
  // password= `${environment.password}`
  grant_type = `${environment.grant_types}`;

  accessToken: any;
  newurl: any;
  embededToken: any;
  type = 'report';
  eventHandlers: Map<string, EventHandler | null> = new Map<
    string,
    EventHandler | null
  >([]);

  constructor(
    private powerBIService: PowerBiService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });
  }

  ngOnInit(): void {
    alert('hi');
    if (this.currentRoute.includes('report')) {
      this.userService.activeNavIcon('report');
    }
    // (window as any).powerbi = pbi.service;
    this.addTokenData();
  }
  addTokenData() {
    //     this.username = sessionStorage.getItem('email');
    // console.log(this.username,'user name');

    const object = {
      grant_type: this.grant_type,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      resource: this.resource,
      tenant_id: this.tenant_id,
      // username: this.username,
      // password: this.password,
      scope: this.powerbiScope,
    };

    //this api will generate access toknenF
    this.powerBIService.generateTokenFirst(object).subscribe(
      (data: any) => {
        console.log('response data:', data);
        this.accessToken = data.body.access_token;
        console.log('accessToken: ', this.accessToken);
        this.getEmbedUrl(this.accessToken);
      },
      (error: HttpErrorResponse) => {
        console.log('error while creating access token: ', error);

        alert(`error while creating access token: ${error}`);
      }
    );
  }

  //this api will generate embedded URL
  getEmbedUrl(Accesstoken: any) {
    this.powerBIService.getEmbededUrl(this.reportId, Accesstoken).subscribe(
      (data1: any) => {
        console.log('Emebded URL: ', data1);
        this.newurl = data1.embedUrl;
        console.log('new url: ', this.newurl);
        this.generateEmbededToken(data1);
      },
      (error: HttpErrorResponse) => {
        console.log('error while generating embedded url: ', error);
        alert(`alert while generating embedded url: ${error}`);
      }
    );
  }

  // method to generate embededd token
  generateEmbededToken(data: any) {
    console.log(data, 'Embeded data');
    const object = {
      accessToken: this.accessToken,
      accessLevel: 'View',
      allowSaveAs: 'false',
      effectiveEntity: [
        {
          username: sessionStorage.getItem('email'),
          roles: 'Pwc_Viewer',
          datasets: data.datasetId,
        },
      ],
    };

    //this api will generate embedded token
    this.powerBIService
      .embededGenerateToken(object, data.id, this.workSpaceId)
      .subscribe(
        (tokenData: any) => {
          if (tokenData.body.error.code == 'InvalidRequest') {
            alert('Kindly refresh the application to generate new token..!!');
          } else {
            console.log('embedeToken: ', tokenData);
            this.embedReport(data.id, data.embedUrl, tokenData.body.token);
            console.log(data.id, 'id');
          }
        },
        (error: HttpErrorResponse) => {
          console.log('error while generating embedded token: ', error);
          alert(`alert while generating embedded token: ${error}`);
        }
      );
  }

  embedReport(reportId: string, embedUrl: string, token: any) {
    try {
      const reportContainer = document.getElementById('embed-container');
      console.log(reportContainer, 'before model:');

      let model = (window as unknown as WindowWithPowerBiClient)[
        'powerbi-client'
      ]?.models;

      console.log('models: ', models);
      console.log('model: ', model);

      let config: models.IReportEmbedConfiguration = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: token,
        embedUrl: embedUrl,
        id: reportId,
        permissions: models.Permissions.All,
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true,
          panes: {
            filters: {
              visible: true,
            },
            pageNavigation: {
              visible: true,
            },
          },
        },
      };

      console.log('Config: ', config);

      const report: any = powerbi.embed(reportContainer, config);
    } catch (error) {
      console.log('Error log: ', error);
    }
  }

  // embedReport1(reportId: string, embedUrl: string, token: any) {
  //   const reportContainer = document.getElementById('embed-container');

  //   if ((window as any).powerbi) {
  //     // Access Power BI models
  //     const models = (window as any).powerbi.models;
  //     console.log('models: ', models);

  //     // Configure embedding
  //     let config: models.IReportEmbedConfiguration = {
  //       type: 'report',
  //       // tokenType: models.TokenType.Embed,
  //       tokenType: models.TokenType
  //         ? models.TokenType.Aad
  //         : models.TokenType.Embed,
  //       accessToken: token,
  //       embedUrl: embedUrl,
  //       id: reportId,
  //       permissions: models.Permissions.All,
  //       settings: {
  //         filterPaneEnabled: true,
  //         navContentPaneEnabled: true,
  //         panes: {
  //           filters: {
  //             visible: true,
  //           },
  //           pageNavigation: {
  //             visible: true,
  //           },
  //         },
  //       },
  //     };

  //     // Embed the Power BI report
  //     const report: any = (window as any).powerbi.embed(
  //       reportContainer,
  //       config
  //     );
  //   } else {
  //     console.error('Power BI client library not found.');
  //   }
  // }
}
