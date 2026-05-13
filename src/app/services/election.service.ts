import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Election } from '../models/election.model';
import { AdherentLite } from '../models/adherent-lite.model';
import { ElectionPublic } from '../models/election-public.model';
import { VoteRequest } from '../models/vote-request.model';

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
  getAllElections() {
    return this.http.get<Election[]>(
      `${this.apiUrl}`
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
    data: any
  ) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
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

  publishElection(id: number) {

    return this.http.put(
      `${this.apiUrl}/${id}/publish`,
      {}
    );
  }

  unpublishElection(id: number) {

    return this.http.put(
      `${this.apiUrl}/${id}/unpublish`,
      {}
    );
  }

  rejectElection(id: number) {

    return this.http.put(
      `${this.apiUrl}/${id}/reject`,
      {}
    );
  }

  getEligibleAdherents(
    electionId: number
  ) {

    return this.http.get<AdherentLite[]>(
      `${this.apiUrl}/${electionId}/eligible-adherents`
    );
  }

  // PUBLIC ACTIVE ELECTIONS
  getActiveElections():
  Observable<ElectionPublic[]> {

    return this.http.get<ElectionPublic[]>(
      `${this.apiUrl}/actifs`
    );
  }

  // PUBLIC ACTIVE ELECTION BY ID
  getActiveElectionById(
    id: number
  ): Observable<ElectionPublic> {

    return this.http.get<ElectionPublic>(
      `${this.apiUrl}/actifs/${id}`
    );
  }

  voter(
    request: VoteRequest
  ) {

    return this.http.post(
      'http://localhost:8080/api/votes',
      request
    );
  }

  getElectionStats(
    electionId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/${electionId}/stats`
    );
  }

}