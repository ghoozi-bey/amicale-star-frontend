import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

type User = {
  nom: string;
  prenom: string;
  email: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {}

  // 🔥 USER STATE (TEMPS RÉEL)
  private userSubject = new BehaviorSubject<User | null>(this.getUser());
  user$ = this.userSubject.asObservable();

  // 🔥 PHOTO STATE
  private photoSubject = new BehaviorSubject<string | null>(null);
  photo$ = this.photoSubject.asObservable();

  // ✅ LOGIN
  login(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.api}/login`,
      data
    ).pipe(

      tap((res: any) => {

        // NO TOKEN = ERROR RESPONSE
        if (!res?.token) return;

        // TOKEN
        localStorage.setItem(
          "token",
          res.token
        );

        // DECODE JWT
        const payload = JSON.parse(
          atob(res.token.split('.')[1])
        );

        // ROLE
        if (payload.role) {

          localStorage.setItem(
            "role",
            payload.role
          );

        }

        // USER STATE
        this.userSubject.next({

          nom: payload.nom || "",

          prenom: payload.prenom || "",

          email: payload.sub || ""

        });

      })

    );

  }

  // ✅ TOKEN
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ✅ USER FROM TOKEN
  getUser(): User | null {
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

  // 🔥 SET USER
  setUser(user: User) {
    this.userSubject.next(user);
  }

  // 🔥 UPDATE USER
  updateUser(data: any) {
    const current = this.userSubject.value || {
      nom: '',
      prenom: '',
      email: ''
    };

    this.userSubject.next({
      nom: data.nom ?? current.nom,
      prenom: data.prenom ?? current.prenom,
      email: current.email
    });
  }

  // 🔥 PHOTO
  setUserPhoto(photo: string | null) {
    this.photoSubject.next(photo);
  }

  getUserPhoto() {
    return this.photoSubject.value;
  }

  // ✅ LOGIN CHECK
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ LOGOUT
  logout() {
    localStorage.clear();
    this.userSubject.next(null);
    this.photoSubject.next(null);
  }
}