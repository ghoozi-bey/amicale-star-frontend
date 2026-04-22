import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-profile.html',
  styleUrls: ['./admin-user-profile.css']
})
export class AdminUserProfile {
  user: any;
  matricule!: string;

  private api = 'http://localhost:8080/api/admin/users';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.matricule = this.route.snapshot.paramMap.get('matricule')!;
    this.loadUser();
  }

  loadUser() {
    this.http.get(`${this.api}/${this.matricule}`, {
      headers: { Authorization: 'Bearer ' + this.authService.getToken() }
    }).subscribe((data: any) => {

      this.user = data;

      this.cdr.detectChanges(); // forces UI updates
    });
  }

  editUser() {
    this.router.navigate(['/admin-edit-user', this.user.matricule]);
  }

  deleteUser() {
    if (confirm("Supprimer cet utilisateur ?")) {
      this.http.delete(`${this.api}/${this.user.matricule}`, {
        headers: { Authorization: 'Bearer ' + this.authService.getToken() }
      }).subscribe(() => {
        this.router.navigate(['/admin-users']);
      });
    }
  }


}
