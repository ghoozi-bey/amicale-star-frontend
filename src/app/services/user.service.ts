import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdherentLite } from '../models/adherent-lite.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  api = "http://localhost:8080/api/admin/users";

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number) {

    return this.http.get<any>(
      `${this.api}?page=${page}&size=${size}`
    );

  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  delete(matricule: string) {
    return this.http.delete(`${this.api}/${matricule}`);
  }

  updateProfile(data: any) {
    return this.http.put('http://localhost:8080/api/user/profile', data);
  }

  // AJOUT
  getProfile() {
    return this.http.get('http://localhost:8080/api/user/profile');
  }
  
  getAllLite() {

    return this.http.get<AdherentLite[]>(
      'http://localhost:8080/api/user/lite'
    );
  }
  
}