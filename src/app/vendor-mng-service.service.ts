import {
  HttpClient,
  HttpClientModule,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Role } from "./admin/role/model/role";
import { User } from "./admin/user/model/user";
import { newProject } from "./business-user/project/model/project";
import { Vendor } from "./business-user/vendor/model/vendor";

@Injectable({
  providedIn: "root",
})
export class VendorMngServiceService {
  constructor(private http: HttpClient) {}
  templateDescriptionData: any;
  project: any;
  templateDetails: any;
  draftTemplateDetails: any;
  pageProgressBar: boolean = false;
  isDraftRedirect: boolean = false;
  
  // services for user management

  login(data:any){
    return this.http.post(`${environment.url1}/login`,data );
  }
  addUser(userData: any) {
    console.log(userData, " data is in service now");

    return this.http.post(`${environment.url1}/vendor/user`, userData);
  }

  getuUser() {
    return this.http.get(`${environment.url1}/vendor/user/list`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.url1}/vendor/user/delete/${id}`);
  }

  getUserById(id: string) {
    return this.http.get(`${environment.url1}/vendor/user/${id}`);
  }

  updateUser(data: User,userId:string) {
    return this.http.patch(`${environment.url1}/vendor/user/${userId}`, data);
  }

  // services for role management
  addRole(userData: any) {
    console.log(userData," data before adding");
    
    return this.http.post(`${environment.url1}/vendor/role`, userData,{
      responseType: "text",
    });
  }

  getuRole() {
    return this.http.get(`${environment.url1}/vendor/role/getAll`);
  }

  deleteRole(id: string) {
    console.log(id, " will get deleted");

    return this.http.delete(`${environment.url1}/vendor/role/${id}`);
  }

  deleteRoles(id: string) {
    return this.http.delete(`${environment.url}/vendor/role/${id}`);
  }

  getRoleById(id: string) {
    return this.http.get(`${environment.url1}/vendor/role/${id}`);
  }

  updateRole(data: Role,roleId:string) {
    console.log(data,"too be edited");
    
    return this.http.patch(
      `${environment.url1}/vendor/role/edit/${roleId}`,
      data
    );
  }

  getRoles() {
    return this.http.get(`${environment.url1}/vendor/role/getAll`);
  }

  // services for vendor management
  addVendor(userData: any) {
    return this.http.post(`${environment.url1}/vendor/newVendor`, userData);
  }

  getVendors() {
    return this.http.get(`${environment.url1}/vendor/newVendor/list`);
  }

  deleteVendor(id: string) {
    return this.http.delete(`${environment.url1}/vendor/newVendor/${id}`);
  }

  getVendorById(id: string) {
    return this.http.get(`${environment.url1}/vendor/newVendor/${id}`);
  }

  updateVendor(data: Vendor,vendorId:string) {
    return this.http.patch(
      `${environment.url1}/vendor/newVendor/update/${vendorId}`,
      data
    );
  }

  // services for project management
  addClient(clientData: any) {
    return this.http.post(`${environment.url1}/vendor/project`, clientData);
  }

  updateProject(data: newProject,clientFormId:string) {
    return this.http.patch(
      `${environment.url1}/vendor/project/edit/${clientFormId}`,
      data
    );
  }

  deleteProject(id: string) {
    return this.http.delete(`${environment.url}/client/${id}`);
  }

  getProjectById(id: string) {
    return this.http.get(`${environment.url1}/vendor/project/${id}`);
  }

  getClients() {
    return this.http.get(`${environment.url1}/vendor/project/getproject`);
  }

  getdocByProjectId(id:string) {
    return this.http.get(`${environment.url1}/vendor/project/docu/${id}`);
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
    return this.http.post(`${environment.url}/templates`, data);
  }

  getTemplateDetails() {
    console.log("hiii");
    
    return this.http.get(`${environment.url}/templates`);
  }
  
  getTemplateDetailsByUser(user:any) {
    console.log("hiii");
    
    return this.http.get(`${environment.url}/templates`);
  }

  getTemplateDetails1(user:string) {
    console.log("hiii", user);
    
    return this.http.get(`${environment.url}/templates/createdBy/${user}`);
  }

  uploadDoc(file: File,projectid:string) {
    const formdata: any = new FormData();
    formdata.append("file", file);
    formdata.append("projectid", projectid);

    // const req=this.http.post(`${environment.url1}/vendor/file/uploadDoc`,)

    const req = new HttpRequest(
      "POST",
      `${environment.url1}/vendor/project/upload`,
      formdata,
      {}
    );
    return this.http.request(req);
  }

  // id = "F22B2925-B8EA-4977-8797-F7F1C586C6B3";
  // download(id:string) {
  //   console.log("to be download");
    
  //   return this.http.get(
  //     `${environment.url1}/vendor/project/download/${id}`,
  //     {
  //       reportProgress: true,
  //       responseType: "blob",
  //     }
  //   );
  // }


  downloadDocByVersion(projectid:string,version:string) {
    console.log("to be download");
    
    return this.http.get(
      `${environment.url1}/vendor/project/${projectid}/${version}`,
      {
        reportProgress: true,
        responseType: "blob",
      }
    );
  }

  downloadFile(projectid:string) {
    console.log("to be download");
    
    return this.http.get(
      `${environment.url1}/vendor/project/download/${projectid}`,
      {
       
        reportProgress: true,
        responseType: "blob",
      }
    );
  }

  getuserByroleName(roleName:string){
    return this.http.get(`${environment.url1}/vendor/user/getUsersByroleName/${roleName}`);
  }
}
