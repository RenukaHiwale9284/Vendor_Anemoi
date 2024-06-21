import { Role } from "../../role/model/role";

export interface User{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    mobileNumber:string;
    role:Role;
    manager:string;
    partner:string;
    checked:boolean;
    userStatus:string;
    createdOn:Date;
    createdBy:string;
}


// export interface Role{
//     role:string;
// }

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