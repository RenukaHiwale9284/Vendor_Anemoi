import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from '../admin/role/model/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  addRole(userData: any) {
    console.log(userData, ' data before adding');

    return this.http.post(`${environment.url}/roles`, userData, {

    });
  }

  getuRole() {
    return this.http.get(`${environment.url}/roles`);
  }

  deleteRole(id: string) {
    console.log(id, ' will get deleted');

    return this.http.delete(`${environment.url}/roles/${id}`);
  }

  deleteRoles(id: string) {
    return this.http.delete(`${environment.url}/roles/${id}`);
  }

  getRoleById(id: string) {
    return this.http.get(`${environment.url}/roles/${id}`);
  }

  getRoleByName(roleName: string) {
    return this.http.get(`${environment.url}/roles/${roleName}`);
  }

  updateRole(data: Role) {
    console.log(data, 'too be edited');

    return this.http.put(
      `${environment.url}/roles/${data.roleName}`,
      data
    );
  }

  getRoles() {
    return this.http.get(`${environment.url}/roles`);
  }

  getuserByroleName(roleName: string) {
    return this.http.get(
      `${environment.url}/users/roles/${roleName}`
    );
  }
}
