import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  evenements$!: Observable<any[]>;
  selectedEvent: any = null;

  totalImages = 0;
  loadedImages = 0;

  constructor(
    private evenementService: EvenementService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.loadEvenements();
  }

  loadEvenements(): void {

  this.loadingService.show();

  this.evenements$ = this.evenementService.getPublicEvents().pipe(

    map((events: any[]) => {
      this.totalImages = events.length;
      this.loadedImages = 0;

      if (this.totalImages === 0) {
        this.loadingService.hide();
      }

      return events.map((e: any) => ({
        ...e,
        imageUrl: `http://localhost:8080/api/evenements/photo/${e.id}`
      }));
    }),

    tap({
      error: () => this.loadingService.hide()
    })
  );
}

  onImageLoad(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  onImageError(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  goToInscription(id: number): void {
    this.router.navigate(['/inscription', id]);
  }

  openDetails(e: any): void {
    this.selectedEvent = e;
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  goToDetails(event: any): void {
  this.router.navigate(['/evenement'], {
    state: { event: event }
  });
}
}