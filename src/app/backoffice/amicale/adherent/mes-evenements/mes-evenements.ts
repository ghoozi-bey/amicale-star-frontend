import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';

@Component({
  selector: 'app-mes-evenements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-evenements.html',
  styleUrls: ['./mes-evenements.css']
})
export class MesEvenementsComponent implements OnInit {

  inscriptions: any[] = [];
  loading = false;

  constructor(private eventService: EvenementService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.eventService.getMesInscriptions().subscribe({
      next: (data: any[]) => {
        this.inscriptions = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
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