import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  loadTypes(selectedId?: number) {
    const token = this.authService.getToken();

    this.http.get<any[]>('http://localhost:8080/api/admin/type-evenements', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: (data) => {

        this.typeEvenements = data;

        // Set selected value AFTER options exist
        if (selectedId != null) {
          setTimeout(() => {
            this.user.typeEvenementId = Number(selectedId);
            this.cdr.detectChanges(); // keep your logic
          });
        }
        console.log("OPTIONS:", data);
        console.log("OPTIONS IDS:", data.map(t => t.id));
        console.log("OPTIONS TYPES:", data.map(t => typeof t.id));

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading types:", err);
      }
    });
  }

  loadUser(matricule: string) {
    this.http.get<any>(`${this.api}/${matricule}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe({
      next: (data) => {
        console.log("RAW DATA:", data);
        console.log("TYPE EVENEMENT FROM BACK:", data.typeEvenement);

        this.user = {
          ...data,
          password: '',
          dateNaissance: data.dateNaissance,
          typeAdherent: data.typeAdherent,
          typeEvenementId: data.typeEvenementId ?? null
        };

        // Load types ONLY if needed and pass selected value
        if (this.user.typeAdherent === 'MEMBRE_AMICALE') {
          this.loadTypes(this.user.typeEvenementId);
        }
        console.log("USER MODEL:", this.user);
        console.log("user.typeEvenementId:", this.user.typeEvenementId, typeof this.user.typeEvenementId);

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Erreur chargement utilisateur";
      }
    });
  }

  onTypeChange() {
    if (this.user.typeAdherent !== 'MEMBRE_AMICALE') {
      this.user.typeEvenementId = null;
    } else {
      this.loadTypes();
    }
  }

  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.user.nom || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(this.user.nom)) {
      this.validationErrors.nom = "Nom invalide";
    }

    if (!this.user.prenom || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(this.user.prenom)) {
      this.validationErrors.prenom = "Prénom invalide";
    }

    if (!this.user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      this.validationErrors.email = "Email invalide";
    }

    if (!this.user.cin || !/^\d{8}$/.test(this.user.cin)) {
      this.validationErrors.cin = "CIN invalide";
    }

    if (!this.user.telephone || !/^\d{8}$/.test(this.user.telephone)) {
      this.validationErrors.telephone = "Téléphone invalide";
    }

    if (!this.user.departement) {
      this.validationErrors.departement = "Département obligatoire";
    }

    if (!this.user.typeAdherent) {
      this.validationErrors.typeAdherent = "Type adhérent obligatoire";
    }

    if (this.user.typeAdherent === 'MEMBRE_AMICALE' &&
        !this.user.typeEvenementId) {
      this.validationErrors.typeEvenementId = "Type événement obligatoire";
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  updateUser() {
    // 🔥 FRONT VALIDATION
    if (!this.validateForm()) {
      this.errorMessage = "⚠️ Corrige les erreurs du formulaire";
      return;
    }

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
      dateNaissance: this.user.dateNaissance,
      typeAdherent: this.user.typeAdherent,
      typeEvenementId: this.user.typeEvenementId,
      actif: this.user.actif
    };

    if (this.user.password && this.user.password.trim() !== '') {
      updatedFields.password = this.user.password;
    }

    this.http.patch(`${this.api}/${this.user.matricule}`, updatedFields, {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: () => {
        this.successMessage = '✅ Utilisateur mis à jour';

        setTimeout(() => {
          this.router.navigate(['/admin-users']);
        }, 2000);
      },

      error: (err) => {
        console.log("ERROR BODY:", err.error);

        if (err.error && typeof err.error === 'object') {
          this.errorMessage = "⚠️ Corrige les erreurs du formulaire";
          this.validationErrors = { ...err.error }; // 🔥 duplicates here
        } else {
          this.errorMessage = err.error || "Erreur serveur";
        }

        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }
  
}