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
      next: (data: any[]) => {

        this.events = (data || []).map((i: any) => ({
          id: i.evenementId,        
          titre: i.titre,
          statut: i.statut,

          imageUrl: `${this.apiUrl}/photo/${i.evenementId}`
        }));

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

  onImageError(event: any) {
    event.target.src = 'assets/default-event.png';
  }
}