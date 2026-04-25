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

    // Matricule: STAR + 6 digits
    if (!this.newUser.matricule) {
      this.validationErrors.matricule = "Matricule obligatoire";
    } else if (!/^STAR\d{6}$/.test(this.newUser.matricule)) {
      this.validationErrors.matricule = "Format: STAR suivi de 6 chiffres (ex: STAR000001)";
    }

    // Nom: letters only
    if (!this.newUser.nom) {
      this.validationErrors.nom = "Nom obligatoire";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(this.newUser.nom)) {
      this.validationErrors.nom = "Nom doit contenir uniquement des lettres";
    }

    // Prénom: letters only
    if (!this.newUser.prenom) {
      this.validationErrors.prenom = "Prénom obligatoire";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(this.newUser.prenom)) {
      this.validationErrors.prenom = "Prénom doit contenir uniquement des lettres";
    }

    // Email: valid format
    if (!this.newUser.email) {
      this.validationErrors.email = "Email obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newUser.email)) {
      this.validationErrors.email = "Email invalide";
    }

    // Password
    if (!this.newUser.password) {
      this.validationErrors.password = "Mot de passe obligatoire";
    } else if (this.newUser.password.length < 6) {
      this.validationErrors.password = "Mot de passe min 6 caractères";
    }

    // Date de naissance: must be in the past
    if (!this.newUser.dateNaissance) {
      this.validationErrors.dateNaissance = "Date de naissance obligatoire";
    } else if (new Date(this.newUser.dateNaissance) >= new Date()) {
      this.validationErrors.dateNaissance = "Date de naissance doit être dans le passé";
    }

    // CIN: 8 digits
    if (!this.newUser.cin) {
      this.validationErrors.cin = "CIN obligatoire";
    } else if (!/^\d{8}$/.test(this.newUser.cin)) {
      this.validationErrors.cin = "CIN doit contenir 8 chiffres";
    }

    // Téléphone: 8 digits
    if (!this.newUser.telephone) {
      this.validationErrors.telephone = "Téléphone obligatoire";
    } else if (!/^\d{8}$/.test(this.newUser.telephone)) {
      this.validationErrors.telephone = "Téléphone invalide (8 chiffres)";
    }

    // Departement required
    if (!this.newUser.departement) {
      this.validationErrors.departement = "Département obligatoire";
    }

    // Type Adherent required
    if (!this.newUser.typeAdherent) {
      this.validationErrors.typeAdherent = "Type adhérent obligatoire";
    }

    // TypeEvenement required only for MEMBRE_AMICALE
    if (this.newUser.typeAdherent === 'MEMBRE_AMICALE' && !this.newUser.typeEvenementId) {
      this.validationErrors.typeEvenementId = "Type événement obligatoire pour MEMBRE_AMICALE";
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

        if (err.error && typeof err.error === 'object') {
          this.validationErrors = err.error; // erreurs de duplication
          this.cdr.detectChanges();
        } else {
          this.errorMessage = err.error || "Erreur serveur";
          this.cdr.detectChanges();
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