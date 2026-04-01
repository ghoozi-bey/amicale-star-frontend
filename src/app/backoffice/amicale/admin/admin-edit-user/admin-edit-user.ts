import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-edit-user.html',
  styleUrls: ['./admin-edit-user.css']
})
export class AdminEditUserComponent {

  user: any = null; // will hold user info from DB
  private api = 'http://localhost:8080/api/admin/users';

  errorMessage: string = '';
  successMessage: string = '';
  validationErrors: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const matricule = this.route.snapshot.paramMap.get('matricule');
    if (matricule) {
      this.loadUser(matricule);
    }
  }

  loadUser(matricule: string) {
    this.http.get(`${this.api}/${matricule}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges(); // forces UI update
      },
      error: (err) => {
        console.error('Erreur chargement user', err);
        this.errorMessage = "Erreur chargement utilisateur";
      }
    });
  }

  updateUser() {
    const token = localStorage.getItem('token');

    // patch only modified fields
    const updatedFields: any = {};
    for (const key in this.user) {
      if (this.user[key] !== null && this.user[key] !== undefined) {
        updatedFields[key] = this.user[key];
      }
    }

    this.http.patch(`${this.api}/${this.user.matricule}`, updatedFields, {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: () => {
        this.successMessage = '✅ Utilisateur mis à jour';
        this.router.navigate(['/admin-users']); // go back to list
      },
      error: (err) => {
        console.error('Erreur mise à jour', err);
        this.errorMessage = 'Erreur lors de la mise à jour';
      }
    });
  }
}