import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inscriptions-evenement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inscriptions-evenement.html',
  styleUrls: ['./inscriptions-evenement.css'],
})
export class InscriptionsEvenement implements OnInit {

  inscriptions: any[] = [];
  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router // 🔥 ajouté
  ) {}

  ngOnInit(): void {
    // 🔥 meilleure pratique (support navigation dynamique)
    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('id'));
      console.log("EVENT ID =", this.eventId);

      this.loadInscriptions();
    });
  }

  // 🔥 méthode séparée (propre)
  loadInscriptions() {
    // ⚠️ TEMPORAIRE (remplacer par backend)
    this.inscriptions = [
      {
        id: 1,
        nom: 'Ghazi Bey',
        email: 'ghazi@email.com',
        modePaiement: 'NON_PAYE',
        statut: 'EN_ATTENTE'
      },
      {
        id: 2,
        nom: 'Ali Test',
        email: 'ali@test.com',
        modePaiement: 'PAYE',
        statut: 'ACCEPTEE'
      }
    ];
  }

  // 👁️ voir détails (optionnel)
  voirDetails(inscriptionId: number) {
    this.router.navigate(['/inscription', inscriptionId]);
  }

  // ✅ accepter
  accepter(inscriptionId: number) {
    console.log("ACCEPTER", inscriptionId);

    // 🔥 simulation update
    this.inscriptions = this.inscriptions.map(i =>
      i.id === inscriptionId ? { ...i, statut: 'ACCEPTEE' } : i
    );
  }

  // ❌ refuser
  refuser(inscriptionId: number) {
    console.log("REFUSER", inscriptionId);

    this.inscriptions = this.inscriptions.map(i =>
      i.id === inscriptionId ? { ...i, statut: 'REFUSEE' } : i
    );
  }
  voirInscriptions(eventId: number) {
  this.router.navigate(['/gestion-inscriptions', eventId]);
}
}