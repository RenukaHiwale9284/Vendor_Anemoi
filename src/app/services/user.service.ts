import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../admin/user/model/user';
import { Subject } from 'rxjs';
import { encreptedDataObject } from '../admin/user/user.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  navIcon = new Subject();

  public navIconSubscriber$ = this.navIcon.asObservable();

  activeNavIcon(data: any) {
    console.log(data,'active nav.....');
    this.navIcon.next(data);
  }

  // services for user management
  addUser(userData: any,secretKey:any) {
    console.log(userData, ' data is in service now');
    console.log(userData.encreptedData, ' data is in service now');
    const encreptedData=userData.encreptedData;
    const plainText=userData;
    const sec=secretKey;
  
    return this.http.post(`${environment.url}/users`, {encreptedData}
    );
  }

  getuUser() {
    return this.http.get(`${environment.url}/users`,{
      responseType: 'text'
    });
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.url}/users/${id}`);
  }

  getUserById(id: string) {
    return this.http.get(`${environment.url}/users/${id}`);
  }

  getUserByMailId(id: string) {
    return this.http.get(`${environment.url}/users/email/${id}`,{
      responseType:'json'
    });
  }

  updateUser(data: User, userId: string) {
    return this.http.put(`${environment.url}/users/${userId}`, data);
  }

  loginUser(data: any) {
    return this.http.post(`${environment.url}/login`, data, {});
  }

  getAllNotifications() {
    return this.http.get(`${environment.url}/getNotification`);
  }

  getAllNotificationsCount() {
    return this.http.get(
      `${environment.url}/getNotificationCount/${sessionStorage.getItem(
        'email'
      )!}`
    );
  }

  deleteAllNotifications(id: string) {
    return this.http.get(`${environment.url}/getNotification/${id}`);
  }

  clearNotification(id: any) {
    return this.http.delete(`${environment.url}/clearNotification/${id}`);
  }
  clearAllNotifications(id: any) {
    return this.http.delete(`${environment.url}/deleteAllNotification/${id}`);
  }
}
