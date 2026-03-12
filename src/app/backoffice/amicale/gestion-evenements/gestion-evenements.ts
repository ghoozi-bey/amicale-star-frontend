import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-evenements',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gestion-evenements.html',
  styleUrl: './gestion-evenements.css'
})
export class GestionEvenementsComponent {

  event = {
    titre: '',
    lieu: '',
    date_debut: '',
    date_fin: '',
    nb_places: 0,
    prix: 0,
    description: ''
  };

  createEvent() {
    console.log("Nouvel événement :", this.event);

    // ici plus tard on enverra vers Supabase
  }

}