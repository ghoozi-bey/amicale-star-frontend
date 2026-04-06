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
        this.events = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}