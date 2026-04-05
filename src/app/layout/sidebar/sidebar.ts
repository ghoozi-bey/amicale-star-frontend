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

  // Menu states
  showEventsMenu = false;
  showSondagesMenu = false;
  showElectionsMenu = false;
  showUsersMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    // Clean display name
    if (this.user) {
      if (this.user.prenom && this.user.nom) {
        this.userName = `${this.user.prenom} ${this.user.nom}`;
      } else {
        this.userName = this.user.email || '';
      }
    }
  }

  // Role check (single role only)
  hasRole(role: string): boolean {
    if (!this.user || !this.user.role) return false;
    return this.user.role.includes(role);
  }

  // Toggles
  toggleEvents(): void {
    this.showEventsMenu = !this.showEventsMenu;
  }

  toggleSondages(): void {
    this.showSondagesMenu = !this.showSondagesMenu;
  }

  toggleElections(): void {
    this.showElectionsMenu = !this.showElectionsMenu;
  }

  toggleUsers(): void {
    this.showUsersMenu = !this.showUsersMenu;
  }
}