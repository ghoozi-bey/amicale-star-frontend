import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent {

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
    departement: '',
    typeAdherent: 'ADHERENT',
    typeEvenement: null
  };

  users: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
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

  createUser() {
  const token = localStorage.getItem("token");

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
      alert("✅ Utilisateur créé");
    },
    error: (err) => {
      console.error("Erreur création user", err);
    }
  });
}
  onRoleChange() {
    if (this.newUser.typeAdherent !== 'MEMBRE_AMICALE') {
      this.newUser.typeEvenement = null;
    }
  }
}