import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SondageService } from '../../../../../services/sondage.service';

@Component({
  selector: 'app-sondage-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sondage-detail.html',
  styleUrl: './sondage-detail.css'
})
export class SondageDetailComponent implements OnInit {

  sondage: any;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private sondageService: SondageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.sondageService.getById(id).subscribe({
      next: (data) => {
        this.sondage = data;
        this.cdr.detectChanges(); // forces UI update
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  formatStatus(statut: string): string {
    const map: any = {
      BROUILLON: 'Brouillon',
      PUBLISHED: 'Publié',
      REJECTED: 'Rejeté',
      ACTIF: 'Actif',
      TERMINE: 'Terminé'
    };

    return map[statut] || statut;
  }

  publish() {
    if (!this.sondage?.id) return;

    // reset messages
    this.successMessage = '';
    this.errorMessage = '';

    this.sondageService.publish(this.sondage.id).subscribe({
      next: () => {
        this.successMessage = '✅ Sondage publié avec succès';
        this.cdr.detectChanges(); // forces UI update

        // wait 2s then reload page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Erreur lors de la publication';
        this.cdr.detectChanges(); // forces UI update
      }
    });
  }

  unpublish() {
    if (!this.sondage?.id) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.sondageService.unpublish(this.sondage.id).subscribe({
      next: () => {
        this.successMessage = '⛔ Publication annulée';
        this.cdr.detectChanges(); // forces UI update

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Erreur lors de l’annulation';
        this.cdr.detectChanges(); // forces UI update
      }
    });
  }
}