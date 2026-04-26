import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-inscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-inscriptions.html',
  styleUrls: ['./gestion-inscriptions.css'],
})
export class GestionInscriptions implements OnInit {

  inscriptionId!: number;
  data: any;
  paiements: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inscriptionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  // 🔥 LOAD GLOBAL
  loadAll() {
    this.loading = true;

    this.http.get(`http://localhost:8080/api/inscriptions/${this.inscriptionId}/full`)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.loadPaiements();
        },
        error: (err) => {
          console.error("Erreur details", err);
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  // 🔥 LOAD PAIEMENTS
  loadPaiements() {
    this.http.get<any[]>(`http://localhost:8080/api/paiements/inscription/${this.inscriptionId}`)
      .subscribe({
        next: (res) => {

          // 🔥 TRI
          this.paiements = res.sort((a, b) => {
            if (!a.datePaiement) return -1;
            if (!b.datePaiement) return 1;
            return new Date(a.datePaiement).getTime() - new Date(b.datePaiement).getTime();
          });

          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("Erreur paiements", err);
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  // 🔥 VALIDER PAIEMENT (OPTIMISÉ)
  payer(id: number) {

    if (!confirm("Confirmer le paiement ?")) return;

    this.http.put(`http://localhost:8080/api/paiements/${id}/statut`, {})
      .subscribe({
        next: () => {

          // 🔥 UPDATE LOCAL (PAS DE RELOAD)
          const p = this.paiements.find(x => x.id === id);

          if (p) {
            p.statut = 'PAYE';
            p.datePaiement = new Date().toISOString().split('T')[0];
          }

          this.cd.detectChanges();
        },
        error: (err) => {
          console.error("Erreur paiement", err);
        }
      });
  }

  // 🔥 PDF
  openPdf(base64: string) {
    if (!base64) return;
    const url = "data:application/pdf;base64," + base64;
    window.open(url, "_blank");
  }

  // 🔥 STATUT INSCRIPTION
  valider() {
    this.updateStatut('ACCEPTEE');
  }

  refuser() {
    this.updateStatut('REFUSEE');
  }

  updateStatut(statut: string) {
    this.http.put(
      `http://localhost:8080/api/inscriptions/${this.inscriptionId}/statut?statut=${statut}`,
      {}
    ).subscribe({
      next: () => {
        this.data.statut = statut;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Erreur update statut", err);
      }
    });
  }
  voirJustificatif(paiementId: number) {

  const token = localStorage.getItem('token');

  this.http.get(
    `http://localhost:8080/api/paiements/${paiementId}/justificatif`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }
  ).subscribe(blob => {

    const url = window.URL.createObjectURL(blob);
    window.open(url);

  });
}
}