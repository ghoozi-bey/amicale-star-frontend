import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

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

  photoUrlWithCache: string | null = null;

  sidebarCollapsed = false;

  private profileListener!: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {

    this.user$ = this.authService.user$;

    const role = localStorage.getItem('role');
    this.userRole = role ? role.replace('ROLE_', '') : '';

    this.loadProfilePhoto();

    this.profileListener = () => {
  this.zone.run(() => {
    this.loadProfilePhoto(true); // 🔥 force refresh ici
  });
};

    window.addEventListener('profileUpdated', this.profileListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('profileUpdated', this.profileListener);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  loadProfilePhoto(forceRefresh: boolean = false) {

  // 🔥 ne bloque que si pas de refresh ET déjà chargé
  if (this.photoUrlWithCache && !forceRefresh) return;

  this.loadingPhoto = true;

  this.http.get<any>('http://localhost:8080/api/user/profile')
    .subscribe({
      next: (data) => {

        this.zone.run(() => {

          if (data?.hasPhoto && data?.photoUrl) {

            // 🔥 IMPORTANT : toujours reconstruire URL si refresh
            const newPhoto = forceRefresh
              ? data.photoUrl + '?t=' + new Date().getTime()
              : data.photoUrl;

            // 🔥 éviter re-render inutile
            if (this.photoUrlWithCache !== newPhoto) {
              this.userPhoto = newPhoto;
              this.photoUrlWithCache = newPhoto;
              this.authService.setUserPhoto(newPhoto);
            }

          } else {
            this.userPhoto = null;
            this.photoUrlWithCache = null;
          }

          this.loadingPhoto = false;

        });

      },
      error: () => {
        this.zone.run(() => {
          this.userPhoto = null;
          this.photoUrlWithCache = null;
          this.loadingPhoto = false;
        });
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

  onImageError(event: any) {
    event.target.src = 'assets/default-pfp.jpg';
  }
}