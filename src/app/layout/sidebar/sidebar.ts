import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  user: any = {};
  userName: string = '';

  isAdmin = false;
  isAmicale = false;

  showEventsMenu = false;
  showUsersMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    const role = this.user?.role || '';

    // 🔥 FIX SAFE ROLE
    this.isAdmin = role.includes('ADMIN');
    this.isAmicale = role.includes('MEMBRE_AMICALE');

    // 🔥 NOM PROPRE
    if (this.user) {
      if (this.user.prenom && this.user.nom) {
        this.userName = `${this.user.prenom} ${this.user.nom}`;
      } else {
        this.userName = this.user.email || '';
      }
    }
  }

  toggleEvents() {
    this.showEventsMenu = !this.showEventsMenu;
  }

  toggleUsers() {
    this.showUsersMenu = !this.showUsersMenu;
  }
}