import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (user) {
      // ✅ priorité prénom + nom
      if (user.prenom && user.nom) {
        this.userName = `${user.prenom} ${user.nom}`;
      } else {
        // ✅ fallback propre
        this.userName = user.email || 'Utilisateur';
      }
    } else {
      this.userName = 'Utilisateur';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}