import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Vendor } from '../business-user/vendor/model/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http:HttpClient) { }

    // services for vendor management
    addVendor(userData: any) {
      console.log(userData,'in servise data');
      
      console.log(userData.encreptedData, ' data is in service now');
      const encreptedData=userData.encreptedData;
      return this.http.post(`${environment.url}/vendors`, {encreptedData});
    }
  
    getVendors() {
      return this.http.get(`${environment.url}/vendors`,{
        responseType: 'text'
      });
    }
  
    deleteVendor(id: string) {
      return this.http.delete(`${environment.url}/vendors/${id}`);
    }
  
    getVendorById(id: string) {
      return this.http.get(`${environment.url}/vendors/${id}`);
    }
  
    getVendorByName(name: string) {
      return this.http.get(`${environment.url}/vendors/vendorName/${name}`);
    }
  
    updateVendor(data: Vendor,vendorId:string) {
      return this.http.put(
        `${environment.url}/vendors/${vendorId}`,
        data
      );
    }
}
