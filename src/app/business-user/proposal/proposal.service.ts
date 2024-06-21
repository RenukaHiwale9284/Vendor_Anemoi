import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProposalService {

    constructor(private http: HttpClient) { }

    getProposalDetails() {
        return this.http.get(`${environment.url}/projects`);
    }

    getscoreCards() {
        return this.http.get(`${environment.url}/score_cards`,{

            responseType:'text'
        });
    }

    updateProposalData(data: any) {
        console.log(data,'data in service==================');
        
      const  encreptedData=data.encreptedData;
      console.log(encreptedData,'in service data');
      
      return this.http.post(`${environment.url}/score_cards`, {encreptedData});
    }

    getVendorList() {
        return this.http.get(`${environment.url}/vendors`,{
            responseType:'text'
        });
    }

    updateScorcard(scorcardId: number, data: any) {
        return this.http.put(`${environment.url}/score_cards/`+scorcardId, data);
    }



    addDataTOFinalTable(data:any){
        return this.http.post(`${environment.url}/scoredata/jsondata`, data);
    }

    deleteScorecardFromFinalTable(scorecardId:any){
        return this.http.delete(`${environment.url}/scoredata/${scorecardId}`)
    }
}
