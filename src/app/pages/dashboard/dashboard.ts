import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router'; // 🔥 AJOUT

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
    private loadingService: LoadingService,
    private router: Router // 🔥 AJOUT
  ) {
    this.loadEvenements();
  }

  loadEvenements(): void {

  this.loadingService.show();

  this.evenements$ = this.evenementService.getEvenementsActifs().pipe(

    tap(events => {
      this.totalImages = events.length;
      this.loadedImages = 0;

      if (this.totalImages === 0) {
        this.loadingService.hide();
      }
    }),

    // 🔥 FIX CRITIQUE
    tap({
      error: () => {
        this.loadingService.hide();
      }
    })

  );
}

  // 🔥 IMAGE LOAD
  onImageLoad(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  // 🔥 IMAGE ERROR
  onImageError(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.loadingService.hide();
    }
  }

  // 🔥 NAVIGATION VERS PAGE INSCRIPTION
  goToInscription(id: number): void {
    this.router.navigate(['/inscription', id]);
  }

  // 🔥 (OPTIONNEL) INSCRIPTION DIRECT
  

  // 🔥 SI TU UTILISE POPUP
  openDetails(e: any): void {
    this.selectedEvent = e;
  }

  trackById(index: number, item: any) {
  return item.id;
}
}