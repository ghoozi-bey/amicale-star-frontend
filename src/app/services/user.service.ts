import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = {
    nom: "Ghazi",
    role: "amicale"   // simulation pour l'instant
  };

  getRole() {
    return this.user.role;
  }

}