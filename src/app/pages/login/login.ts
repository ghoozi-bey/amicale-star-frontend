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
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  login() {

  this.auth.login(this.user).subscribe({

    next: (res: any) => {

      // ✅ TOKEN (si existe)
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }

      // 🔥 TEST FORCÉ (IMPORTANT)
      localStorage.setItem('matricule', 'STAR123455');

      console.log("MAT TEST:", localStorage.getItem('matricule'));

      // ✅ REDIRECTION
      this.router.navigate(['/dashboard']);
    },

    error: () => {
      alert("Email ou mot de passe incorrect");
    }

  });

}
}