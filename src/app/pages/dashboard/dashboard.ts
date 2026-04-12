import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';

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

  // 🔥 gestion images
  totalImages = 0;
  loadedImages = 0;

  constructor(
    private evenementService: EvenementService,
    private loadingService: LoadingService
  ) {
    this.loadEvenements();
  }

  loadEvenements(): void {

    // 🔥 démarre loading
    this.loadingService.show();

    this.evenements$ = this.evenementService.getEvenementsActifs().pipe(
      tap(events => {
        this.totalImages = events.length;
        this.loadedImages = 0;

        // 🔥 si aucun event → stop loading
        if (this.totalImages === 0) {
          this.loadingService.hide();
        }
      })
    );
  }

  // 🔥 appelé quand image chargée
  onImageLoad(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  // 🔥 si image erreur (important)
  onImageError(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  openDetails(e: any): void {
    this.selectedEvent = e;
  }

  closeDetails(): void {
    this.selectedEvent = null;
  }
}