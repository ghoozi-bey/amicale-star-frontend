import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getEvenementsActifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actifs`, {
      headers: this.getHeaders()
    });
  }

  getAllEvenements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getMesEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements`, {
      headers: this.getHeaders()
    });
  }

  createEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evenement, {
      headers: this.getHeaders()
    });
  }

  updateEvenement(id: number, evenement: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, evenement, {
      headers: this.getHeaders()
    });
  }

  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  archiverEvenement(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/archiver`, {}, {
      headers: this.getHeaders()
    });
  }

  getEvenementsCrees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements-crees`, {
      headers: this.getHeaders()
    });
  }
}