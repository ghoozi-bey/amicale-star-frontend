import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  // 🔐 récupérer headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // récupérer tous les événements
  getEvenements(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + "?ts=" + new Date().getTime(),
      { headers: this.getAuthHeaders() }
    );
  }

  // créer un événement
  createEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      evenement,
      { headers: this.getAuthHeaders() }
    );
  }

  // modifier un événement
  updateEvenement(id: number, evenement: any): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}`,
      evenement,
      { headers: this.getAuthHeaders() }
    );
  }

  // supprimer un événement
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // archiver un événement
  archiverEvenement(id: number): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/archiver`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

}