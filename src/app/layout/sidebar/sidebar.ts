import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  userName: string = 'Utilisateur';
  userRole: string = '';

  showEventsMenu = false;
  showSondagesMenu = false;
  showElectionsMenu = false;
  showUsersMenu = false;

  constructor(private router: Router) {}

  ngOnInit() {

    // 🔥 récupérer user depuis localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);

      console.log("USER:", user);

      // 🔥 ROLE CORRECT
      this.userRole = user.typeAdherent;

      // 🔥 NOM (optionnel)
      this.userName = (user.prenom && user.nom)
  ? user.prenom + ' ' + user.nom
  : user.nom || 'Utilisateur';
    }

    console.log("ROLE FINAL:", this.userRole);
  }

  // ✅ NAVIGATION PROFILE
  goToProfile() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  }

  toggleEvents() {
    this.showEventsMenu = !this.showEventsMenu;
  }

  toggleSondages() {
    this.showSondagesMenu = !this.showSondagesMenu;
  }

  toggleElections() {
    this.showElectionsMenu = !this.showElectionsMenu;
  }

  toggleUsers() {
    this.showUsersMenu = !this.showUsersMenu;
  }

  // ✅ FIX FINAL ROLE
  hasRole(role: string): boolean {
    return this.userRole === role;
  }
}