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
  
  typesEvenement = [
    { id: 1, nom: 'OMRA & HAJ' },
    { id: 2, nom: 'VOYAGE' },
    { id: 3, nom: 'CONVENTION' }
  ];

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
  }

  createUser() {
    const token = localStorage.getItem("token");

    // reset messages
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
        this.validationErrors = {}; // clear errors

        this.newUser = {
          matricule: '',
          nom: '',
          prenom: '',
          email: '',
          password: '',
          cin: '',
          telephone: '',
          dateNaissance: '',
          departement: '',
          typeAdherent: 'ADHERENT',
          typeEvenementId: null
        };

        this.loadUsers();
        this.cdr.detectChanges();
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
  onRoleChange() {
    if (this.newUser.typeAdherent !== 'MEMBRE_AMICALE') {
      this.newUser.typeEvenementId = null;
    }
  }
  
  loadUsers() {
    this.http.get<any[]>(
      this.api,
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken()
        }
      }
    ).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error("Erreur chargement users", err);
      }
    });
  }  
  
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
          this.loadUsers(); // refresh
        },
        error: (err) => {
          console.error("Erreur suppression", err);
        }
      });
    }
  }
}