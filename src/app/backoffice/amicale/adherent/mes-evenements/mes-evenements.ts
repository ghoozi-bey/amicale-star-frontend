import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mes-evenements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-evenements.html',
  styleUrls: ['./mes-evenements.css']
})
export class MesEvenementsComponent implements OnInit, OnDestroy {

  inscriptions: any[] = [];
  loading = false;
  matricule: string = '';

  private sub!: Subscription; // 🔥 important

  constructor(private eventService: EvenementService) {}

  ngOnInit(): void {
    this.matricule = localStorage.getItem('matricule') || '';

    if (!this.matricule) {
      console.error("❌ Matricule introuvable");
      return;
    }

    this.load();
  }

  load() {
    this.loading = true;

    this.sub = this.eventService.getMesInscriptions(this.matricule)
      .subscribe({
        next: (data: any[]) => {
          this.inscriptions = data || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    // 🔥 STOP les appels multiples
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getStatutClass(statut: string) {
    switch (statut) {
      case 'ACCEPTEE': return 'ok';
      case 'REFUSEE': return 'refuse';
      case 'EN_ATTENTE': return 'attente';
      default: return '';
    }
  }

  getPaiementClass(p: string) {
    switch (p) {
      case 'PAYE': return 'ok';
      case 'NON_PAYE': return 'refuse';
      case 'EN_VERIFICATION': return 'attente';
      default: return '';
    }
  }
}