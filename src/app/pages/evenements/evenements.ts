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
  loading = false;

  private apiUrl = "http://localhost:8080/api/evenements";

  constructor(
    private eventService: EvenementService,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;

    this.eventService.getAllEvenements().subscribe({
      next: (data: any) => {

        if (Array.isArray(data)) {
          this.events = data.map(e => ({
            ...e,
            imageUrl: `${this.apiUrl}/photo/${e.id}`
          }));
        } else {
          this.events = [];
        }

        this.loading = false;

        this.cdr.detectChanges(); // 🔥 FIX
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;

        this.cdr.detectChanges(); // 🔥 FIX
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