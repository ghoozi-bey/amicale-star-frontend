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

  // 🔥 LOAD DATA
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
      case 'EN_VERIFICATION': return 'attente';
      default: return '';
    }
  }

  // 🔥 FILE SELECT
  onFileSelected(event: any, id: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[id] = file;
    }
  }

  // 🔥 UPLOAD JUSTIFICATIF
  uploadJustificatif(inscriptionId: number) {

    const file = this.selectedFiles[inscriptionId];

    if (!file) {
      this.uploadStatus[inscriptionId] = 'error';
      this.cdr.detectChanges();
      return;
    }

    this.uploadStatus[inscriptionId] = 'loading';
    this.cdr.detectChanges(); // 🔥 refresh immédiat

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');

    this.http.post(
      `http://localhost:8080/api/inscriptions/${inscriptionId}/upload-justificatif`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'text'
      }
    ).subscribe({
      next: () => {
        this.uploadStatus[inscriptionId] = 'success';

        // 🔥 reset fichier
        delete this.selectedFiles[inscriptionId];

        this.cdr.detectChanges();

        // 🔥 reset message après 3s
        setTimeout(() => {
          this.uploadStatus[inscriptionId] = null;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.uploadStatus[inscriptionId] = 'error';
        this.cdr.detectChanges();
      }
    });
  }

}