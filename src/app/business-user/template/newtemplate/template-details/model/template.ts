export interface Template{
    templateId:string;
    status: string;
    templateData: any;
    templateDescription: any;
}

export interface DraftTemplate {
    draftId: number;
    draftTag: string;
    draftVerion: number;
    editedOn: any;
    status: string;
    templateData: any;
    templateDescription: any;
    templateId: number;
}