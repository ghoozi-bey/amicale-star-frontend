import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {}

  // ✅ LOGIN (FIX COMPLET)
  login(data: any): Observable<string> {
    return this.http.post(
      `${this.api}/login`,
      data,
      { responseType: 'text' }
    ).pipe(
      tap((token: string) => {

        // 🔥 save token
        localStorage.setItem("token", token);

        // 🔥 decode token
        const payload = JSON.parse(atob(token.split('.')[1]));

        console.log("JWT PAYLOAD:", payload);

        // 🔥 EXTRAIRE ROLE
        if (payload.role) {
          localStorage.setItem("role", payload.role);
        }

        // 🔥 optionnel (nom affichage)
        if (payload.nom) {
          localStorage.setItem("nom", payload.nom);
        }

        if (payload.prenom) {
          localStorage.setItem("prenom", payload.prenom);
        }

      })
    );
  }

  // ✅ GET TOKEN
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ✅ GET USER
  getUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        ...payload,
        prenom: payload.prenom || null,
        nom: payload.nom || null,
        email: payload.sub || null
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
    localStorage.removeItem("role"); // 🔥 IMPORTANT
    localStorage.removeItem("nom");
    localStorage.removeItem("prenom");
  }
}