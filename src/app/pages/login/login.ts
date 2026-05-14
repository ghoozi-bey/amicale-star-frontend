import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  user = {

    email: '',
    password: ''

  };

  errorMessage = '';

  loading = false;

  constructor(

    private auth: AuthService,

    private router: Router,

    private cdr: ChangeDetectorRef

  ) {}

  login() {

    if (this.loading) return;

    // RESET
    this.errorMessage = '';

    // EMAIL REQUIRED
    if (!this.user.email.trim()) {

      this.errorMessage =
        'Veuillez entrer votre email';

      this.cdr.detectChanges();

      return;

    }

    // PASSWORD REQUIRED
    if (!this.user.password.trim()) {

      this.errorMessage =
        'Veuillez entrer votre mot de passe';

      this.cdr.detectChanges();

      return;

    }

    // START LOADING
    this.loading = true;

    this.cdr.detectChanges();

    this.auth.login(this.user).subscribe({

      next: (res: any) => {

        // STOP LOADING
        this.loading = false;

        // HANDLE ERRORS
        if (res.message) {

          switch (res.message) {

            case 'EMAIL_NOT_FOUND':

              this.errorMessage =
                'Email incorrect';

              break;

            case 'INVALID_PASSWORD':

              this.errorMessage =
                'Mot de passe incorrect';

              break;

            case 'ACCOUNT_DISABLED':

              this.errorMessage =
                'Votre compte est désactivé';

              break;

            case 'SERVER_ERROR':

              this.errorMessage =
                'Erreur serveur interne';

              break;

            default:

              this.errorMessage =
                'Erreur inconnue';

          }

          this.cdr.detectChanges();

          return;

        }

        // SUCCESS
        if (res?.token) {

          localStorage.setItem(
            'token',
            res.token
          );

          this.cdr.detectChanges();

          this.router.navigate([
            '/dashboard'
          ]);

          return;

        }

        // INVALID RESPONSE
        this.errorMessage =
          'Réponse invalide du serveur';

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.errorMessage =
          'Erreur serveur';

        this.cdr.detectChanges();

      }

    });

  }

  clearError() {

    if (!this.errorMessage) return;

    this.errorMessage = '';

    this.cdr.detectChanges();

  }

}