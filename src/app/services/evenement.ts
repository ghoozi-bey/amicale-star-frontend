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
    Authorization: `Bearer ${token}` // ✅ propre
  });
}

  // 🔥 événements actifs
  getEvenementsActifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actifs`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 tous les événements
  getAllEvenements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // 🔥 événements de l'utilisateur
  getMesEvenements(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/mes-evenements-crees`,
    { headers: this.getHeaders() }
  );
}

  // ✅ 🔥 AJOUT IMPORTANT (corrige ton bug)
  getEvenementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 créer
  createEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evenement, {
      headers: this.getHeaders()
    });
  }

  // 🔥 modifier
  updateEvenement(id: number, evenement: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, evenement, {
      headers: this.getHeaders()
    });
  }

  // 🔥 supprimer
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 🔥 archiver
  archiverEvenement(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/archiver`, {}, {
      headers: this.getHeaders()
    });
  }

  // 🔥 événements créés
  getEvenementsCrees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements-crees`, {
      headers: this.getHeaders()
    });
  }
  getMesInscriptions() {

  const matricule = localStorage.getItem('matricule');

  console.log("MAT FETCH:", matricule); // 🔥 DEBUG

  if (!matricule) {
    throw new Error("Matricule null ❌");
  }

  return this.http.get<any[]>(
    `http://localhost:8080/api/inscriptions/mes-inscriptions/${matricule}`,
    { headers: this.getHeaders() }
  );
}
inscrire(eventId: number) {

  const matricule = localStorage.getItem('matricule'); // ⚠️ important

  return this.http.post(
    `http://localhost:8080/api/inscriptions/${matricule}/${eventId}`,
    {},
    { headers: this.getHeaders() }
  );
}
}