import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ProposalService {

    constructor(private http: HttpClient) { }

    getProposalDetails() {
        return this.http.get(`${environment.url}/projects`);
    }

    getscoreCards() {
        return this.http.get(`${environment.url}/score_cards`);
    }

    updateProposalData(data: any) {
      return this.http.post(`${environment.url}/score_cards`, data);
    }

    getVendorList() {
        return this.http.get(`${environment.url}/vendors`);
    }

    updateScorcard(scorcardId: number, data: any) {
        return this.http.put(`${environment.url}/score_cards/`+scorcardId, data);
    }
}
