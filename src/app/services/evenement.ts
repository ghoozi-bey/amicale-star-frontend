import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  // récupérer tous les événements
  getEvenements(): Observable<any[]> {
  return this.http.get<any[]>("http://localhost:8080/api/evenements?ts=" + new Date().getTime());
}

  // créer un événement
  createEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evenement);
  }

  // modifier un événement
  updateEvenement(id: number, evenement: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, evenement);
  }

  // supprimer un événement
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // archiver un événement
  archiverEvenement(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/archiver`, {});
  }

}
