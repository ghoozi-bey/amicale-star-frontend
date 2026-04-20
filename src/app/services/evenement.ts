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

  getPublicEvents(): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      'http://localhost:8080/api/evenements/public',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
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
  const matricule = localStorage.getItem('matricule'); // 🔥 IMPORTANT

  return this.http.get<any[]>(
    `${this.apiUrl}/mes-evenements-crees?matricule=${matricule}`,
    { headers: this.getHeaders() }
  );
}

  getEvenementById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, {
    headers: this.getHeaders() // 🔥 IMPORTANT
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

  getMesInscriptions() {
  const token = localStorage.getItem('token');

  return this.http.get<any[]>(
    'http://localhost:8080/api/inscriptions/mes-inscriptions',
    {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
  );
}

  
createInscription(formData: FormData) {
  return this.http.post(
    'http://localhost:8080/api/inscriptions/create',
    formData,
    {
      responseType: 'text' // ✅ FIX parsing error
    }
  );
}
getNbPlaces(eventId: number) {
  return this.http.get<number>(`http://localhost:8080/api/evenements/${eventId}/places`);
}
}