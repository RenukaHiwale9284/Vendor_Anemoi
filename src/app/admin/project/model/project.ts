export interface Client {
  id: string;
  clientName: string;
  industry: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Project {
  id: string;
  projectName: string;
  projectCode: string;
  partner: string;
  manager: string;
  businessUser: string;
}
export interface Project1 {
  businessUser:string;
}

export interface Rfp {
  id: string;
  rfpName: string;
  description: string;
  date: Date;
}

export interface businessOwnerForm {
  projectOwnerId: "";
  firstname: "";
  lastname: "";
  email: "";
}

export interface newProject {
  projectId: string;
  projectownerid: string;
  clientName: string;
  industry: string;
  projectName: string;
  projectCode: string;
  partnerName: string;
  managerName: string;
  businessUser: string[];
  rfpName: string;
  description: string;
  date: Date;
  businessOwner: businessOwnerForm[];
  createdOn:any;
  createdBy:any;
  firstName:any;
  lastName:any;
  email:any;
  selectedVendors:any[];
}

export interface Industry {
  industryName: string;
}

export interface BusinessUser {
  name: string;
}

export interface Manager {
  name: string;
  email:string;
  designation:string;
  location:string;
  LOS:string;
}

export interface Partner {
  name: string;
  email:string;
  designation:string;
  location:string;
  LOS:string;
}

export interface DocData {
  docId: string;
  docName: string;
  docType: string;
  projectId: string;
  uploadedDate: string;
  version: string;
}
