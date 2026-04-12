import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
    ).pipe(
      tap((token: string) => {

        // 🔥 STOCKER UNIQUEMENT TOKEN
        localStorage.setItem("token", token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("JWT PAYLOAD:", payload);

        // 🔥 STOCKER ROLE SEULEMENT
        if (payload.role) {
          localStorage.setItem("role", payload.role);
        }

      })
    );
  }

  // ✅ GET TOKEN
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ✅ GET USER (DEPUIS TOKEN)
  getUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return {
        prenom: payload.prenom || "",
        nom: payload.nom || "",
        email: payload.sub || ""
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
    localStorage.clear(); // 🔥 CLEAN TOTAL
  }
  private userPhoto: string | null = null;

setUserPhoto(photo: string | null) {
  this.userPhoto = photo;
}

getUserPhoto(): string | null {
  return this.userPhoto;
}
private userName: string = '';

setUserName(name: string) {
  this.userName = name;
}

getUserName() {
  return this.userName;
}
}