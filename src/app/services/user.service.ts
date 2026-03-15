import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:8080/api/adherents';

  getUser(){
 return JSON.parse(localStorage.getItem("user") || "{}");
}

  constructor(private http: HttpClient) {}

  getRole() {
    const user = this.getUser();
    return user.role;
  }

  getProfile(){
 const user=this.getUser();
 return this.http.get(`${this.apiUrl}/profile/${user.matricule}`);
}

  updateProfile(data:any){
    const user=this.getUser();
    return this.http.put(`${this.apiUrl}/profile/${user.matricule}`, data);
  }

}