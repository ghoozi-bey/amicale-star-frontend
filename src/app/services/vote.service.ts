import { Injectable } from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { VoteRequest }
from '../models/vote-request.model';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private apiUrl =
    'http://localhost:8080/api/votes';

  constructor(
    private http: HttpClient
  ) {}

  voter(
    request: VoteRequest
  ) {

    return this.http.post(
      this.apiUrl,
      request
    );
  }

  hasVoted(
    electionId: number
  ) {

    return this.http.get<boolean>(
      `${this.apiUrl}/me/${electionId}`
    );
  }
}