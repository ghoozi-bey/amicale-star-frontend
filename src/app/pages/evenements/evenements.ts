import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenements.html',
  styleUrls: ['./evenements.css']
})
export class EventsComponent implements OnInit {

  events: any[] = [];
  loading = true;

  private apiUrl = "http://localhost:8080/api/evenements";

  constructor(
    private eventService: EvenementService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;

    this.eventService.getMesInscriptions().subscribe({
      next: (data: any) => {

        this.events = (data || [])
          .filter((i: any) => i && i.evenement)
          .map((i: any) => {

            const e = i.evenement;

            return {
              id: e.id,
              titre: e.titre,
              lieu: e.lieu,
              dateDebut: e.dateDebut,
              dateFin: e.dateFin,
              statut: i.statut,

              // 🔥 backend gère tout
              imageUrl: `${this.apiUrl}/photo/${e.id}`
            };
          });

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToInscription(eventId: number) {
    this.router.navigate(['/inscription', eventId]);
  }

  // 🔥 simple (juste sécurité)
  onImageError(event: any) {
    event.target.src = 'assets/default-event.png'; // optionnel
  }
}