import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  constructor(private http: HttpClient) { }

  getScorecards(){
    return this.http.get(`${environment.url}/score_cards`,{
      responseType:'text'
    });
  }
}
