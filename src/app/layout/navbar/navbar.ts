import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  userName: string = 'Utilisateur';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // ✅ 1. AFFICHAGE IMMÉDIAT (JWT)
    const user = this.authService.getUser();

    if (user) {
      if (user.prenom && user.nom) {
        this.userName = `${user.prenom} ${user.nom}`;
      } else {
        this.userName = user.email || 'Utilisateur';
      }
    }

    // ✅ 2. RAFRAÎCHISSEMENT API (SILENCIEUX)
    this.loadUser();

    // 🔥 écoute update profil
    window.addEventListener('profileUpdated', () => {
      this.loadUser();
    });
  }

  loadUser() {
    this.http.get<any>('http://localhost:8080/api/user/profile')
      .subscribe({
        next: (data) => {

          if (data?.prenom && data?.nom) {
            this.userName = `${data.prenom} ${data.nom}`;
          } else if (data?.email) {
            this.userName = data.email;
          }

        },
        error: () => {
          // ❌ on ne touche pas au JWT fallback
          console.log("API profile failed, fallback JWT utilisé");
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}