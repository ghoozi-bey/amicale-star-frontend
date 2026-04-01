import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {}

  // ✅ LOGIN
  login(data: any): Observable<string> {
    return this.http.post(
      `${this.api}/login`,
      data,
      { responseType: 'text' }
    ) as Observable<string>;
  }

  // ✅ SAVE TOKEN
  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  // ✅ GET TOKEN
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ✅ GET USER (decode JWT)
  getUser() {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
      ...payload, // ⚠️ IMPORTANT → ne casse rien
      prenom: payload.prenom || payload.firstName || null,
      nom: payload.nom || payload.lastName || null,
      email: payload.sub || payload.email || null
    };

  } catch {
    return null;
  }
}

  // ✅ CHECK LOGIN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ LOGOUT
  logout() {
    localStorage.removeItem("token");
  }
}