import { Component } from '@angular/core';

@Component({
  selector: 'app-evenements',
  standalone: true,
  templateUrl: './evenements.html',
  styleUrl: './evenements.css'
})
export class EvenementsComponent {

  // simulation pour le moment
  mesEvenements = [
    {
      titre: 'Sortie plage',
      lieu: 'Hammamet',
      date: '2026-06-10'
    },
    {
      titre: 'Tournoi football',
      lieu: 'Tunis',
      date: '2026-07-01'
    }
  ];

}