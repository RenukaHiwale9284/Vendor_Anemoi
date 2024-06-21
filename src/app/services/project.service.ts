import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { newProject } from '../business-user/project/model/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  // services for project management
  addClient(clientData: any) {

    const encreptedData = clientData.encreptedData;
    console.log(encreptedData, 'encrypted data in service123');
    return this.http.post(`${environment.url}/projects`, { encreptedData },);
  }

  updateProject(data: newProject, clientFormId: string) {
    return this.http.put(`${environment.url}/projects/${clientFormId}`, data);
  }

  deleteProject(id: string) {
    return this.http.delete(`${environment.url}/projects/${id}`);
  }
  deleteBusinessOwner(id: string) {
    return this.http.delete(`${environment.url}/projects/${id}`);
  }

  getProjectById(id: string) {
    return this.http.get(`${environment.url}/projects/${id}`);
  }

  getClients() {
    return this.http.get(`${environment.url}/projects`, {
      responseType: 'text'
    });
    console.log('project service');

  }

  getdocByProjectId(id: string) {
    return this.http.get(`${environment.url}/projects/${id}`);
  }

  // to save project info
  addProject(projectData: any) {
    return this.http.post(`${environment.url}/project`, projectData);
  }

  getProjects() {
    return this.http.get(`${environment.url}/project`);
  }

  // to save rfp info

  addRfp(rfpData: any) {
    return this.http.post(`${environment.url}/RFP_Details`, rfpData);
  }

  getRfpDetails() {
    return this.http.get(`${environment.url}/RFP_Details`);
  }

  // new template services
  addTemplateDetails(data: any) {
    return this.http.post(`${environment.url}/Template_Details`, data);
  }

  getTemplateDetails() {
    return this.http.get(`${environment.url}/Template_Details`);
  }

  uploadDoc(file: File) {
    const formdata: any = new FormData();
    formdata.append('file', file);

    // const req=this.http.post(`${environment.url}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      'POST',
      `${environment.url}/files/upload`,
      formdata,
      {
        responseType: 'text',
      }
    );
    return this.http.request(req);
  }

  uploadMasterTemplate(file: File) {
    const formdata: any = new FormData();
    formdata.append('file', file);

    // const req=this.http.post(`${environment.url}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      'POST',
      `${environment.url}/excelFile/`,
      formdata,
      {
        responseType: 'text',
      }
    );
    return this.http.request(req);
  }

  document(doc: any) {
    return this.http.post(`${environment.url}/documents`, doc);
  }

  updateDocument(id: any, doc: any) {
    return this.http.put(`${environment.url}/documents/${id}`, doc);
  }

  // id = "F22B2925-B8EA-4977-8797-F7F1C586C6B3";
  // download(id:string) {
  //   console.log("to be download");

  //   return this.http.get(
  //     `${environment.url}/vendor/project/download/${id}`,
  //     {
  //       reportProgress: true,
  //       responseType: "blob",
  //     }
  //   );
  // }

  downloadDocByVersion(projectid: string, version: string) {
    console.log('to be download');

    return this.http.get(
      `${environment.url}/projects/${projectid}/${version}`,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );
  }

  downloadFile(projectid: string) {
    console.log('to be download');

    return this.http.get(`${environment.url}/files/download/${projectid}`, {
      reportProgress: true,
      responseType: 'blob',
    });
  }

  downloadMasterTemplate() {
    // console.log("to be download");

    return this.http.get(`${environment.url}/excelFile/downloadTemp`, {
      reportProgress: true,
      responseType: 'blob',
    });
  }

  getDocDataBYProjectId(id: any) {
    return this.http.get(
      `${environment.url}/documents/documentByProjectId/${id}`
    );
  }

  getDocDataBYScoredcardId(id: any) {
    return this.http.get(
      `${environment.url}/documents/documentByScorecardId/${id}`
    );
  }

  addDetaggedVendor(data: any) {
    return this.http.post(`${environment.url}/detag/`, data);
  }

  deleteRetaggedVendors(data: any) {
    return this.http.delete(`${environment.url}/detag/${data}`)
  }

  getDetaggedVendors(projectId: any) {
    return this.http.get(`${environment.url}/detag/${projectId}`);
  }

  getScorecardsByProjectId(projectId: any) {
    return this.http.get(`${environment.url}/score_cards/scorecard/${projectId}`);
  }
}
