import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TemplatebuilderService {

  dialogFormDataObserver = new Subject();
  public dialogFormDataSubscriber$ = this.dialogFormDataObserver.asObservable();

  constructor(private http: HttpClient) { }


  getCategoryDropdown(){
    return this.http.get(`${environment.url}/categoryDropdown`)
  }


  getProduct()
  {
    return this.http.get(`${environment.url}/TemplateBuilder`)
  }

  addProduct(newdata:any){
    return this.http.post(`${environment.url}/templateBuilder/`,newdata)
  }

  updateProduct(newdata:any){
    return this.http.put(`${environment.url}/templateBuilder/${newdata.id}`,newdata)
  }

  deleteProduct(id:string){
    return this.http.delete(`${environment.url}/templateBuilder/${id}`)
  }

  copyProduct(newdata:any){
    console.log("new data",newdata);
    
    return this.http.post(`${environment.url}/templateBuilder`,newdata) 
  }

  emitDialogFormData(data: any) {
    this.dialogFormDataObserver.next(data);
  }


}
