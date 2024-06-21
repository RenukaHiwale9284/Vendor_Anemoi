export interface Template{
    id:string;
    name:string;
    description:string;
    projectName: string;
    status: string;
    createdOn:Date;
    createdBy:string;
    templateData: any;
    templateDescription: any[];
}