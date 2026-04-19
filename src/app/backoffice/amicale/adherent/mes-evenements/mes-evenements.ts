import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../../../services/evenement';
import { HttpClient } from '@angular/common/http';

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
  matricule: string = '';

  selectedInscription: any = null;
  showModal = false;

  constructor(
    private eventService: EvenementService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

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

    this.eventService.getMesInscriptions(this.matricule)
      .subscribe({
        next: (data: any[]) => {
          this.inscriptions = data || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  openDetails(id: number) {
  console.log("CLICK:", id);

  // 🔥 ouvrir modal directement
  this.showModal = true;
  this.selectedInscription = null;

  this.http.get<any>(`http://localhost:8080/api/inscriptions/${id}`)
    .subscribe({
      next: (data) => {
        console.log("DATA:", data);
        this.selectedInscription = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert("Erreur backend !");
        this.closeModal();
      }
    });
}

  closeModal() {
    this.showModal = false;
    this.selectedInscription = null;
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