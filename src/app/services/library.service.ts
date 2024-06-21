import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  constructor(private http: HttpClient) {}

  addCategory(category: any) {  
    return this.http.post(`${environment.url}/master`, category);
  }

  getCategories() {
    return this.http.get(`${environment.url}/master`);
  }

  editLineItem(id: string, data: any) {
    return this.http.put(
      `${environment.url}/master/${id}`,
      data
    );
  }

  deleteLineItem(id: number) {
    return this.http.delete(`${environment.url}/master/${id}`);
  }
}
