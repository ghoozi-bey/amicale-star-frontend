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
  paiementsMap: { [key: number]: any[] } = {}; // 🔥 paiements par inscription

  loading = false;

  uploadStatus: { [key: number]: 'success' | 'error' | 'loading' | null } = {};
  selectedFiles: { [key: number]: File } = {};

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

  // 🔥 LOAD INSCRIPTIONS
  load() {
    this.loading = true;

    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'http://localhost:8080/api/inscriptions/mes-inscriptions',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (data) => {
        this.inscriptions = data || [];

        // 🔥 charger paiements pour chaque inscription
        this.inscriptions.forEach(insc => {
          this.loadPaiements(insc.id);
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔥 LOAD PAIEMENTS PAR INSCRIPTION
  loadPaiements(inscriptionId: number) {
    this.http.get<any[]>(`http://localhost:8080/api/paiements/inscription/${inscriptionId}`)
      .subscribe({
        next: (res) => {
          this.paiementsMap[inscriptionId] = res;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur paiements", err);
        }
      });
  }

  // 🔥 MODAL
  openDetails(id: number) {
    this.showModal = true;
    this.selectedInscription = null;

    this.http.get<any>(`http://localhost:8080/api/inscriptions/${id}`)
      .subscribe({
        next: (data) => {
          this.selectedInscription = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.closeModal();
        }
      });
  }

  closeModal() {
    this.showModal = false;
    this.selectedInscription = null;
  }

  // 🔥 BADGES
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
      case 'EN_ATTENTE': return 'attente';
      default: return '';
    }
  }

  // 🔥 FILE SELECT (par paiementId)
  onFileSelected(event: any, paiementId: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[paiementId] = file;
    }
  }

  // 🔥 CONDITIONS AFFICHAGE UPLOAD
  isVirement(p: any): boolean {
    return p.modePaiement === 'VIREMENT';
  }

  isDansPeriode(p: any): boolean {
    if (!p.datePaiement) return true; // avance

    const today = new Date();
    const datePaiement = new Date(p.datePaiement);

    const diff = (datePaiement.getTime() - today.getTime()) / (1000 * 3600 * 24);

    return diff <= 7;
  }

  canUpload(p: any): boolean {
    return this.isVirement(p)
      && this.isDansPeriode(p)
      && p.statut === 'EN_ATTENTE'
      && !p.justificatifVirement;
  }

  // 🔥 UPLOAD PAR ÉCHÉANCE
  uploadJustificatif(paiementId: number, inscriptionId: number) {

    const file = this.selectedFiles[paiementId];

    if (!file) {
      this.uploadStatus[paiementId] = 'error';
      this.cdr.detectChanges();
      return;
    }

    this.uploadStatus[paiementId] = 'loading';
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    this.http.put(
      `http://localhost:8080/api/paiements/${paiementId}/upload`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      }
    ).subscribe({
      next: () => {
        this.uploadStatus[paiementId] = 'success';

        delete this.selectedFiles[paiementId];

        // 🔥 refresh paiements
        this.loadPaiements(inscriptionId);

        this.cdr.detectChanges();

        setTimeout(() => {
          this.uploadStatus[paiementId] = null;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.uploadStatus[paiementId] = 'error';
        this.cdr.detectChanges();
      }
    });
  }

}