import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ParticipationRequest {
  sondageId: number;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  questionId: number;
  choixIds?: number[];
  texte?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {

  private apiUrl = 'http://localhost:8080/api/participations';

  constructor(private http: HttpClient) {}

  participate(data: ParticipationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/participate`, data);
  }

  getMyParticipation(sondageId: number) {
    return this.http.get<any>(
      `http://localhost:8080/api/participations/me/${sondageId}`
    );
  }

  hasParticipated(sondageId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-participated/${sondageId}`);
  }

  getResults(sondageId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/results/${sondageId}`);
  }
}