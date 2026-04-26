import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  evenements: any[] = [];
  evenementsActifs: any[] = []; // 🔥 ajout

  selectedEvent: any = null;

  totalImages = 0;
  loadedImages = 0;

  constructor(
    private evenementService: EvenementService,
    private loadingService: LoadingService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.loadEvenements();
  }

  loadEvenements(): void {

    this.loadingService.reset();

    setTimeout(() => {
      this.loadingService.show();
    });

    this.evenementService.getPublicEvents().subscribe({
      next: (events) => {

        this.evenements = events;

        // 🔥 FILTRAGE IMPORTANT
        this.evenementsActifs = events.filter(
          (e: any) => e.statut === 'ACTIF'
        );

        // 🔥 utiliser seulement les actifs pour images
        this.totalImages = this.evenementsActifs.length;
        this.loadedImages = 0;

        this.cd.detectChanges();

        if (this.totalImages === 0) {
          this.loadingService.hide();
        }
      },
      error: () => this.loadingService.hide()
    });
  }

  onImageLoad(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
      this.cd.detectChanges();
    }
  }

  onImageError(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
      this.cd.detectChanges();
    }
  }

  goToInscription(id: number): void {
    this.router.navigate(['/inscription', id]);
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  goToDetails(event: any): void {
    this.router.navigate(['/evenement', event.id]);
  }
}