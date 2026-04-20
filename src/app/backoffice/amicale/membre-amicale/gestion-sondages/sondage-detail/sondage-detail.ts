import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      console.error('ID not found in route');
      return;
    }

    const id = Number(idParam);

    this.sondageService.getById(id).subscribe({
      next: (data) => {
        this.sondage = data;
        this.cdr.detectChanges();
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

  formatType(type: string): string {
    switch (type) {
      case 'CHOIX_UNIQUE': return 'Choix unique';
      case 'CHOIX_MULTIPLE': return 'Choix multiple';
      case 'TEXTE': return 'Réponse libre';
      default: return type;
    }
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

  canEdit(): boolean {
    return this.sondage?.statut === 'BROUILLON' || this.sondage?.statut === 'PUBLISHED';
  }

  onEdit() {
    this.router.navigate(['/gestion-sondages/edit', this.sondage.id]);
  }

  reject() {
    if (!this.sondage?.id) return;

    // confirmation
    const confirmReject = confirm(
      '⚠️ Cette action est irréversible.\nVoulez-vous vraiment rejeter ce sondage ?'
    );

    if (!confirmReject) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.sondageService.reject(this.sondage.id).subscribe({
      next: () => {
        this.successMessage = '❌ Sondage rejeté';
        this.cdr.detectChanges();

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du rejet';
        this.cdr.detectChanges();
      }
    });
  }

  deleteSondage() {
    if (!this.sondage?.id) return;

    const confirmDelete = confirm(
      '⚠️ Cette action est définitive.\nVoulez-vous supprimer ce sondage ?'
    );

    if (!confirmDelete) return;

    this.successMessage = '';
    this.errorMessage = '';

    this.sondageService.delete(this.sondage.id).subscribe({
      next: () => {
        this.successMessage = '🗑️ Sondage supprimé';

        setTimeout(() => {
          this.router.navigate(['/gestion-sondages']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de la suppression';
      }
    });
  }
}