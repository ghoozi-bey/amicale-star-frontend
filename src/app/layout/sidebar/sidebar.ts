import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

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
  loadingPhoto = true;

  // 🔥 PHOTO
  userPhoto: string | null = null;

  showEventsMenu = false;
  showSondagesMenu = false;
  showElectionsMenu = false;
  showUsersMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const user = this.authService.getUser();

    if (user) {
      this.userName = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
    }

    const role = localStorage.getItem('role');
    this.userRole = role ? role.replace('ROLE_', '') : '';

    // 🔥 LOAD PHOTO
    this.loadProfilePhoto();

    // 🔥 LISTEN FOR PROFILE UPDATE
    window.addEventListener('profileUpdated', () => {
      this.loadProfilePhoto();
    });
  }

  // 🔥 CHARGER PHOTO
  loadProfilePhoto() {
  this.loadingPhoto = true;

  this.http.get<any>('http://localhost:8080/api/user/profile')
    .subscribe({
      next: (data) => {

        if (data?.photoUrl) {
          this.userPhoto = data.photoUrl;
        } else {
          this.userPhoto = null;
        }

        this.loadingPhoto = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.userPhoto = null;
        this.loadingPhoto = false;
        this.cdr.detectChanges();
      }
    });
}

  goToProfile(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  }

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

  hasRole(role: string): boolean {
    return this.userRole.toUpperCase() === role.toUpperCase();
  }
}