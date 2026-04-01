import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-users.html',
    styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent {

    users: any[] = [];
    private api = 'http://localhost:8080/api/admin/users';

    constructor(
    private http: HttpClient,
    private authService: AuthService
    ) {}

    ngOnInit() {
    this.loadUsers();
    }

    loadUsers() {
    this.http.get<any[]>(this.api, {
        headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe({
        next: (data) => this.users = data,
        error: (err) => console.error('Erreur chargement users', err)
    });
    }

    deleteUser(matricule: string) {
        if (confirm('Supprimer cet utilisateur ?')) {
            this.http.delete(`${this.api}/${matricule}`, {
            headers: { Authorization: 'Bearer ' + this.authService.getToken() }
            }).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Erreur suppression', err)
            });
        }
    }

    selectedUser: any = null; // user being edited

    editUser(user: any) {
        // store a copy of the user in selectedUser
        this.selectedUser = { ...user };
    }

    updateUser() {
        const token = localStorage.getItem("token");
        this.http.put(`${this.api}/${this.selectedUser.matricule}`, this.selectedUser, {
            headers: { Authorization: 'Bearer ' + token }
        }).subscribe({
            next: () => {
            this.loadUsers();       // refresh table
            this.selectedUser = null; // hide form
            alert('Utilisateur mis à jour ✅');
            },
            error: (err) => {
            console.error('Erreur mise à jour', err);
            alert('Erreur lors de la mise à jour');
            }
        });
    }
}