import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-users.html',
    styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent {

    users: any[] = [];
    private api = 'http://localhost:8080/api/admin/users';

    searchTerm: string = '';
    selectedType: string = '';
    selectedDepartement: string = '';
    sortOrder: string = '';
    departements: string[] = [];
    typesAdherent: string[] = [];

    filteredUsers: any[] = [];

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {}

    ngOnInit() {
    this.loadUsers();
    this.loadEnums();
    }

    loadUsers() {
    this.http.get<any[]>(this.api, {
        headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe({
        next: (data) => {
            this.users = data.map((user: any) => ({
            ...user,
            imageUrl: this.buildImage(user)
        }));
        
        this.filteredUsers = [...this.users]; // initial copy

        this.cdr.detectChanges(); // forces UI update
        },
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

    getUserImage(user: any): string {
        if (user.photo && user.photoType) {
            return `data:${user.photoType};base64,${user.photo}`;
        }

        return 'assets/default-pfp.jpg'; // fallback
    }

    onImageError(event: any) {
        event.target.src = 'assets/default-pfp.jpg';
    }

    buildImage(user: any): string {

        if (user.photo && typeof user.photo === 'string') {
            return `data:${user.photoType};base64,${user.photo}`;
        }

        if (user.photo && Array.isArray(user.photo)) {
            const binary = new Uint8Array(user.photo)
                .reduce((data, byte) => data + String.fromCharCode(byte), '');

            const base64 = btoa(binary);

            return `data:${user.photoType};base64,${base64}`;
        }

        return 'assets/default-pfp.jpg'; // ✅ FIXED
    }

    goToUser(matricule: string) {
        this.router.navigate(['/admin-user-profile', matricule]);
    }

    applyFilters() {

        let result = [...this.users];

        // 🔍 SEARCH
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();

            result = result.filter(user =>
            (user.nom + ' ' + user.prenom).toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
            );
        }

        // 🔽 TYPE
        if (this.selectedType) {
            result = result.filter(user => user.typeAdherent === this.selectedType);
        }

        // 🔽 DEPARTEMENT
        if (this.selectedDepartement) {
            result = result.filter(user => user.departement === this.selectedDepartement);
        }

        // 🔃 SORT
        if (this.sortOrder === 'asc') {
            result.sort((a, b) => a.nom.localeCompare(b.nom));
        }

        if (this.sortOrder === 'desc') {
            result.sort((a, b) => b.nom.localeCompare(a.nom));
        }

        this.filteredUsers = result;
    }

    loadEnums() {
        console.log("🔥 loadEnums called");
        const token = this.authService.getToken();

        this.http.get<string[]>('http://localhost:8080/api/admin/departements', {
            headers: { Authorization: 'Bearer ' + token }
        }).subscribe(data => {
            console.log("DEPARTEMENTS:", data); // 🔥
            this.departements = data;
            this.cdr.detectChanges();
        });

        this.http.get<string[]>('http://localhost:8080/api/admin/types-adherent', {
            headers: { Authorization: 'Bearer ' + token }
        }).subscribe(data => {
            console.log("TYPES ADHÉRENT:", data); // 🔥
            this.typesAdherent = data;
            this.cdr.detectChanges();
        });
        }
}