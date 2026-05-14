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

    currentPage = 0;
    pageSize = 10;

    totalPages = 0;
    totalElements = 0;

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
        this.http.get<any>(
            `${this.api}?page=${this.currentPage}&size=${this.pageSize}`,
            {
                headers: {
                    Authorization: 'Bearer ' + this.authService.getToken()
                }
            }

        ).subscribe({

            next: (res) => {

                this.users = res.content.map((user: any) => ({
                    ...user,

                    typeAdherent: (
                        user.typeAdherent ||
                        user.type_adherent ||
                        user.role ||
                        ''
                    )

                    .replace('ROLE_', '')
                    .toUpperCase()
                }));

                this.filteredUsers = [...this.users];

                this.totalPages = res.totalPages;
                this.totalElements = res.totalElements;

                console.log(this.users);

                this.cdr.detectChanges();

            },

            error: (err) =>
                console.error('Erreur chargement users', err)

        });

    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {

            this.currentPage++;
            this.loadUsers();

        }
    }

    previousPage() {
        if (this.currentPage > 0) {

            this.currentPage--;
            this.loadUsers();

        }
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

    goToUser(matricule: string) {
        this.router.navigate(['/admin-user-profile', matricule]);
    }

    applyFilters() {
        console.log("applyFilters triggered");

        let result = [...this.users];

        // 🔍 SEARCH
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();

            result = result.filter(user =>
            ((user.nom || '') + ' ' + (user.prenom || '')).toLowerCase().includes(term) ||
            (user.email || '').toLowerCase().includes(term)
            );
        }

        // 🔽 TYPE (FIXED)
        if (this.selectedType) {
            result = result.filter(user => {
                console.log("Selected:", this.selectedType);
                console.log("User type:", user.typeAdherent, user.type_adherent);

                const userType = (user.typeAdherent || user.type_adherent || '').replace('ROLE_', '');
                return userType === this.selectedType;
            });
        }

        // 🔽 DEPARTEMENT (safe)
        if (this.selectedDepartement) {
            result = result.filter(user =>
            (user.departement || '') === this.selectedDepartement
            );
        }

        // 🔃 SORT
        if (this.sortOrder === 'asc') {
            result.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
        }

        if (this.sortOrder === 'desc') {
            result.sort((a, b) => (b.nom || '').localeCompare(a.nom || ''));
        }

        this.filteredUsers = result;
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
}