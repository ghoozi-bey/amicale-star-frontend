import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * 🔥 Type de réponse du backend
 */
export interface ChatResponse {
  type: 'text' | 'events';
  message?: string;
  events?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private API_URL = 'http://localhost:8080/api/chatbot/ai';

  constructor(private http: HttpClient) {}

  /**
   * 🔥 Envoi message au chatbot
   */
  sendMessage(msg: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.API_URL, msg);
  }
}

