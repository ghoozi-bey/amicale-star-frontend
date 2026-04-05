import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService { // ✅ corrigé

  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  // 🔑 headers avec token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 🔥 GET ALL
  getEvenements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // 🔥 GET BY ID
  getEvenementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 CREATE
  createEvenement(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event, {
      headers: this.getHeaders()
    });
  }

  // 🔥 DELETE
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 UPDATE (important pour ton modifier)
  updateEvenement(id: number, event: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, event, {
      headers: this.getHeaders()
    });
  }

}