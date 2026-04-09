import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evenements.html',
  styleUrls: ['./evenements.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  events: any[] = [];
  loading = false;
  sub!: Subscription;

  private apiUrl = "http://localhost:8080/api/evenements";

  constructor(
    private eventService: EvenementService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.loadEvents();

    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.loadEvents();
      });
  }

  loadEvents() {
    this.loading = true;

    this.eventService.getMesInscriptions().subscribe({
      next: (data: any[]) => {
        console.log("DATA EVENTS:", data); // 🔥 DEBUG

        this.events = (data || []).map(e => ({
          ...e,
          imageUrl: `${this.apiUrl}/photo/${e.id}` // 🔥 IMAGE FIX
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error("ERREUR EVENTS:", err);
        this.loading = false;
      }
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-event.png';
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}