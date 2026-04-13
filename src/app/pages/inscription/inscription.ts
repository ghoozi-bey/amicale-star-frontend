import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../services/evenement';

@Component({
  selector: 'app-inscription',
  standalone: true,
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent {

  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EvenementService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
  }

  inscrire() {
  this.eventService.inscrire(this.eventId).subscribe({
    next: () => {
      alert("Inscription réussie ✅");
    },
    error: (err) => {
      console.error(err);
      alert("Erreur inscription ❌");
    }
  });
}
}