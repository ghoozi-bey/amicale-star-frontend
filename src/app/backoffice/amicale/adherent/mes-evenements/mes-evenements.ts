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

  selectedInscription: any = null;
  showModal = false;

  constructor(
    private eventService: EvenementService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.load();
  }

  // 🔥 LOAD SANS MATRICULE
  load() {
  this.loading = true;

  const token = localStorage.getItem('token');
  console.log("TOKEN TEST =", token);

  this.http.get<any[]>(
    'http://localhost:8080/api/inscriptions/mes-inscriptions',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: (data) => {
      console.log("DATA OK 🔥", data);
      this.inscriptions = data || [];
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("ERROR ❌", err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  openDetails(id: number) {
    console.log("CLICK:", id);

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