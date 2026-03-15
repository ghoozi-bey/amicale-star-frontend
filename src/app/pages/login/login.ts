import { Component } from '@angular/core';
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
    motdepasse: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  login() {

    this.auth.login(this.user).subscribe({

      next: (data: any) => {

        // sauvegarder utilisateur connecté
        localStorage.setItem("user", JSON.stringify(data));

        // redirection selon role
        if (data.typeAdherent === "AMICALE") {
          this.router.navigate(['/gestion-evenements']);
        } else {
          this.router.navigate(['/dashboard']);
        }

      },

      error: () => {
        alert("Email ou mot de passe incorrect");
      }

    });

  }

}