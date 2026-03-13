import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  getEvenements(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createEvenement(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  deleteEvenement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}