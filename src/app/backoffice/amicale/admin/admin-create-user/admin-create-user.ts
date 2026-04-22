import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-user.html',
  styleUrls: ['./admin-create-user.css']
})
export class AdminCreateUserComponent {

  private api = "http://localhost:8080/api/admin/users";

  newUser: any = {
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    password: '',
    cin: '',
    telephone: '',
    dateNaissance: '',
    departement: null,
    typeAdherent: null,
    typeEvenementId: null
  };

  users: any[] = [];
  
  departements: string[] = [];
  typesAdherent: string[] = [];
  typeEvenements: any[] = [];

  errorMessage: string = '';
  successMessage: string = '';
  validationErrors: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef    
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadEnums();
    this.loadTypes();
  }

  // ================= VALIDATION FRONT =================
  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.newUser.matricule) {
      this.validationErrors.matricule = "Matricule obligatoire";
    }

    if (!this.newUser.nom) {
      this.validationErrors.nom = "Nom obligatoire";
    }

    if (!this.newUser.prenom) {
      this.validationErrors.prenom = "Prénom obligatoire";
    }

    if (!this.newUser.email || !this.newUser.email.includes("@")) {
      this.validationErrors.email = "Email invalide";
    }

    if (!this.newUser.password || this.newUser.password.length < 6) {
      this.validationErrors.password = "Mot de passe min 6 caractères";
    }

    if (!this.newUser.cin || !/^\d{8}$/.test(this.newUser.cin)) {
      this.validationErrors.cin = "CIN doit contenir 8 chiffres";
    }

    if (!this.newUser.telephone || !/^\d{8}$/.test(this.newUser.telephone)) {
      this.validationErrors.telephone = "Téléphone invalide";
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  // ================= LOAD =================
  loadUsers() {
    this.http.get<any[]>(this.api, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    }).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error("Erreur chargement users", err);
      }
    });
  }

  loadEnums() {
    const token = this.authService.getToken();

    this.http.get<string[]>('http://localhost:8080/api/admin/departements', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(data => {
      this.departements = data;
      this.cdr.detectChanges();
    });

    this.http.get<string[]>('http://localhost:8080/api/admin/types-adherent', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe(data => {
      this.typesAdherent = data;
      this.cdr.detectChanges();
    });
  }
  
  loadTypes() {
    const token = this.authService.getToken();

    this.http.get<any[]>('http://localhost:8080/api/admin/type-evenements', {
      headers: { Authorization: 'Bearer ' + token }
    }).subscribe({
      next: (data) => {
        this.typeEvenements = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur chargement types", err)
    });
  }

  // ================= CREATE USER =================
  createUser() {

    // 🔥 validation front
    if (!this.validateForm()) {
      this.errorMessage = "⚠️ Corrige les erreurs du formulaire";
      return;
    }

    const token = localStorage.getItem("token");

    this.errorMessage = '';
    this.successMessage = '';
    this.validationErrors = {};

    this.http.post(
      "http://localhost:8080/api/admin/create-user",
      this.newUser,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.successMessage = "✅ Utilisateur créé avec succès";

        this.newUser = {
          matricule: '',
          nom: '',
          prenom: '',
          email: '',
          password: '',
          cin: '',
          telephone: '',
          dateNaissance: '',
          departement: null,
          typeAdherent: null,
          typeEvenementId: null
        };

        this.validationErrors = {};
        this.loadUsers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("ERROR BODY:", err.error);

        if (typeof err.error === 'object') {
          this.validationErrors = err.error; // erreurs backend
        } else {
          this.errorMessage = err.error || "Erreur serveur";
        }

        this.successMessage = '';
        console.log("REQUEST BODY:", this.newUser);
        this.cdr.detectChanges();
      }
    });
  }

  // ================= ROLE =================
  onRoleChange() {
    if (this.newUser.typeAdherent !== 'MEMBRE_AMICALE') {
      this.newUser.typeEvenementId = null;
    }
  }

  // ================= DELETE =================
  deleteUser(matricule: string) {
    if (confirm("Supprimer cet utilisateur ?")) {
      this.http.delete(
        `http://localhost:8080/api/admin/users/${matricule}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.authService.getToken()
          }
        }
      ).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error("Erreur suppression", err);
        }
      });
    }
  }
}