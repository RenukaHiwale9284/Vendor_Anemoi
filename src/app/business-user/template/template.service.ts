import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  masterTemplateData:any;

  constructor(private http: HttpClient) { }

  getSelectedTemplateData(templateId: number) {
    return this.http.get(`${environment.url}/templates/` + templateId);
  }

  getSelectedProjectTemplates(projectId: number) {
    return this.http.get(`${environment.url}/templates/project/` + projectId);
  }

  getTemplateById(templateId: number) {
    return this.http.get(`${environment.url}/templates/` + templateId);
  }

  getCategoriesData() {
    console.log('check 6');
    return this.http.get(`${environment.url}/master`);
  }


  getDraftDataByDraftid(id:any){
    return this.http.get(`${environment.url}/drafts/${id}`);
  }

  getDocDataBYScoredcardId(id:any){
    return this.http.get(`${environment.url}/documents/documentByScorecardId/${id}`);
  }

  addTemplateData(data: any) {
    return this.http.post(`${environment.url}/templates`, data);
  }

  updateTemplateData(templateId: number, data: any) {
    return this.http.put(`${environment.url}/templates/` + templateId, data);
  }

  getRandomNodeId(length: number = 32) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  getNodeComments(nodeId: string) {
    return this.http.get(`${environment.url}/reviews/` + nodeId);
  }

  putNodeComment(nodeId: string, data: any) {
    return this.http.put(`${environment.url}/reviews/comments/` + nodeId, data);
  }

  postNodeComment(nodeId: string, data: any) {
    return this.http.post(`${environment.url}/reviews`, data);
  }

  putNodeStatus(nodeId: string, data: any) {
    return this.http.put(`${environment.url}/reviews/` + nodeId, data);
  }

  getNodeCommentsAll(templateId: number) {
    return this.http.get(`${environment.url}/api/review_stats/` + templateId);
  }

  saveAsDraft(data: any) {
    return this.http.post(`${environment.url}/drafts`, data);
  }

  updateAsDraft(data: any) {
    console.log("draft data to be update",data);
    
    return this.http.put(`${environment.url}/drafts/` + data.draftId, data);
  }

  getDraftTemplateData() {
    let type='Template'
    return this.http.get(`${environment.url}/drafts/getByType/${type}`)
  }

  deleteDraftTemplate(draftId: number) {
    return this.http.delete(`${environment.url}/drafts/`+draftId);
  }

  getSelectedProjectScorcard(projectId: number) {
    return this.http.get(`${environment.url}/score_cards/` + projectId)
  }

  getSelectedScoreCardById(scoreCardId: number) {
    return this.http.get(`${environment.url}/score_cards/` + scoreCardId)
  }

  transformCategoryData(inputData: any) {
    const categoryData = inputData.filter((data: any) => {
      return (data.type).toLowerCase() == 'category';
    }).map((data: any) => {
      console.log(data,'inside map for filter')
      return { name: data.value }
    });

    const subCategoryData = inputData.filter((data: any) => {
      return (data.type).toLowerCase() == 'subcategory';
    }).map((data: any) => {
      return { name: data.value }
    });

    const parameterData = inputData.filter((data: any) => {
      return (data.type).toLowerCase() == 'parameter';
    }).map((data: any) => {
      return { name: data.value }
    });

    return [{
      "name": "Category",
      "id": "c1",
      "states": categoryData
    },
    {
      "name": "Subcategory",
      "id": "sc1",
      "states": subCategoryData
    },
    {
      "name": "Parameter",
      "id": "p1",
      "states": parameterData
    }];
  }

  filterCommentData(nodeId: string, commentData: any) {
      return commentData.filter( (data: any, index: number) => {
        console.log(nodeId, data.nodeId, ' : filterCommentData')
          return (nodeId == data.nodeId);
      })[0];
  }

  deleteSelectedDrafts(selectedDrafts:any){
    return this.http.delete(`${environment.url}/drafts/${selectedDrafts}`);
  }


  downloadExistingTemplateData(data:any){
    return this.http.post(`${environment.url}/excelFile/temp`,data,{
      reportProgress: true,
      responseType: 'blob',
    });
  }

}
