import { Component } from '@angular/core';
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
export class NavbarComponent {

  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  const user = this.authService.getUser();

  if (user) {
    if (user.prenom && user.nom) {
      this.userName = user.prenom + ' ' + user.nom;
    } else {
      this.userName = user.email; // fallback
    }
  }
}

  logout() {
    this.authService.logout(); // si existe
    this.router.navigate(['/login']);
  }
}