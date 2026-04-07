import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    // ✅ récupérer user depuis token
    const user = this.authService.getUser();

    if (user) {
      this.userName = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
    }

    // ✅ récupérer et corriger le rôle
    const role = localStorage.getItem('role');
    this.userRole = role ? role.replace('ROLE_', '') : '';

    console.log('ROLE FINAL:', this.userRole);
  }

  // ✅ navigation profil
  goToProfile(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  }

  // ✅ menus toggle
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

  // ✅ vérification rôle (robuste)
  hasRole(role: string): boolean {
    return this.userRole.toUpperCase() === role.toUpperCase();
  }
}