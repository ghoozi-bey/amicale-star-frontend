import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Election } from '../models/election.model';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  private apiUrl = 'http://localhost:8080/api/elections';

  constructor(
    private http: HttpClient
  ) {}

  // CREATE
  createElection(
    request: Election
  ): Observable<Election> {

    return this.http.post<Election>(
      this.apiUrl,
      request
    );
  }

  // GET ALL
  getAllElections(): Observable<Election[]> {

    return this.http.get<Election[]>(
      this.apiUrl
    );
  }

  // GET BY ID
  getElectionById(
    id: number
  ): Observable<Election> {

    return this.http.get<Election>(
      `${this.apiUrl}/${id}`
    );
  }

  // UPDATE
  updateElection(
    id: number,
    request: Election
  ): Observable<Election> {

    return this.http.put<Election>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  // DELETE
  deleteElection(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}