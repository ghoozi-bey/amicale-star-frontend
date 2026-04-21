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

  departements: string[] = [];
  typesAdherent: string[] = [];
  typeEvenements: any[] = [];

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
    this.loadEnums();
  }

  loadEnums() {
    const token = this.authService.getToken();

    this.http.get<string[]>('http://localhost:8080/api/admin/departements', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(data => this.departements = data);

    this.http.get<string[]>('http://localhost:8080/api/admin/types-adherent', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(data => this.typesAdherent = data);
  }

  loadTypes() {
    const token = this.authService.getToken();
    console.log("Loading types...");

    this.http.get<any[]>('http://localhost:8080/api/admin/type-evenements', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: (data) => {
        console.log("Types loaded:", data);
        this.typeEvenements = data;

        // force UI refresh after async load
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading types:", err);
        this.cdr.detectChanges();
      }
    });
  }


  loadUser(matricule: string) {
    this.http.get<any>(`${this.api}/${matricule}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe({
      next: (data) => {
        this.user = { ...data };

        // never show encoded password
        this.user.password = '';

        // 🔥 mapping
        this.user.date_naissance = data.dateNaissance;
        this.user.type_adherent = data.typeAdherent;

        // 🔥 IMPORTANT (this was missing)
        this.user.type_evenement_id = data.typeEvenement?.id;

        // 🔥 ONLY load types if needed
        if (this.user.type_adherent === 'MEMBRE_AMICALE') {
          this.loadTypes();
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement user', err);
        this.errorMessage = "Erreur chargement utilisateur";
      }
    });
  }

  onTypeChange() {
    if (this.user.type_adherent !== 'MEMBRE_AMICALE') {
      this.user.type_evenement_id = null;
    } else {
      // force reload when switching to MEMBRE
      this.loadTypes();
    }
  }

  updateUser() {
    const token = localStorage.getItem('token');

    this.validationErrors = {};
    this.errorMessage = '';
    this.successMessage = '';

    const updatedFields: any = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      cin: this.user.cin,
      telephone: this.user.telephone,
      departement: this.user.departement,
      dateNaissance: this.user.date_naissance,
      typeAdherent: this.user.type_adherent,
      typeEvenementId: this.user.type_evenement_id,
      actif: this.user.actif
    };

    // send password ONLY if filled
    if (this.user.password && this.user.password.trim() !== '') {
      updatedFields.password = this.user.password;
    }

    this.http.patch(`${this.api}/${this.user.matricule}`, updatedFields, {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: () => {
        this.successMessage = '✅ Utilisateur mis à jour';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '🔄 Redirection...';
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/admin-users']);
          }, 2000);
        }, 3000);
      },
      error: (err) => {
        console.log("ERROR BODY:", err.error);

        this.validationErrors = { ...(err.error || {}) };
        this.errorMessage = '';
        this.successMessage = '';

        this.cdr.detectChanges();
      }
    });
  }
  
}