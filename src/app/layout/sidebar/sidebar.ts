import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
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

  private profileListener!: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef // 🔥 AJOUT
  ) {}

  ngOnInit(): void {

    this.user$ = this.authService.user$;

    const role = localStorage.getItem('role');
    this.userRole = role ? role.replace('ROLE_', '') : '';

    const existingPhoto = this.authService.getUserPhoto();

    if (existingPhoto) {
      this.userPhoto = existingPhoto;
      this.loadingPhoto = false;
    } else {
      this.loadProfilePhoto();
    }

    this.profileListener = () => {
      this.zone.run(() => {
        this.loadProfilePhoto();
      });
    };

    window.addEventListener('profileUpdated', this.profileListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('profileUpdated', this.profileListener);
  }

  loadProfilePhoto() {
    this.loadingPhoto = true;

    this.http.get<any>('http://localhost:8080/api/user/profile')
      .subscribe({
        next: (data) => {

          this.zone.run(() => {

            if (data?.photoUrl) {
              this.userPhoto = data.photoUrl + '?t=' + new Date().getTime(); // 🔥 cache fix
              this.authService.setUserPhoto(this.userPhoto);
            } else {
              this.userPhoto = null;
              this.authService.setUserPhoto(null);
            }

            this.loadingPhoto = false;

            this.cdr.detectChanges(); // 🔥 FIX FINAL
          });

        },
        error: () => {
          this.zone.run(() => {
            this.userPhoto = null;
            this.loadingPhoto = false;
            this.cdr.detectChanges(); // 🔥 IMPORTANT
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