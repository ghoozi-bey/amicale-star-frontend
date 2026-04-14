import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {

  // ✅ USER REACTIF (FIX)
  user$!: Observable<{
  nom: string;
  prenom: string;
  email: string;
} | null>;


  userRole: string = '';
  loadingPhoto = true;
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

  this.user$ = this.authService.user$;

  const role = localStorage.getItem('role');
  this.userRole = role ? role.replace('ROLE_', '') : '';

  // ✅ NE PAS RELOAD SI DÉJÀ EXISTE
  const existingPhoto = this.authService.getUserPhoto();

  if (existingPhoto) {
    this.userPhoto = existingPhoto;
    this.loadingPhoto = false;
  } else {
    this.loadProfilePhoto();
  }

  window.addEventListener('profileUpdated', () => {
    this.loadProfilePhoto();
  });
}


  loadProfilePhoto() {
    this.loadingPhoto = true;

    this.http.get<any>('http://localhost:8080/api/user/profile')
      .subscribe({
        next: (data) => {

          if (data?.photoUrl) {
            this.userPhoto = data.photoUrl;
            this.authService.setUserPhoto(data.photoUrl);
          } else {
            this.userPhoto = null;
            this.authService.setUserPhoto(null);
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
    this.router.navigate(['/profile']);
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