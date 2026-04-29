import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inscriptions-evenement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inscriptions-evenement.html',
  styleUrls: ['./inscriptions-evenement.css'],
})
export class InscriptionsEvenement implements OnInit {

  inscriptions: any[] = [];
  eventId!: number;
  loading = true;
  currentPage = 0;
pageSize = 5;
totalPages = 0;

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private http: HttpClient,
  private cdr: ChangeDetectorRef // 🔥
) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const newId = Number(params.get('id'));

    if (this.eventId !== newId) {
      this.eventId = newId;
      this.loadInscriptions();
    }
  });
}

  loadInscriptions() {
  this.loading = true;

  this.http.get<any>(
    `http://localhost:8080/api/inscriptions/event/${this.eventId}?page=${this.currentPage}&size=${this.pageSize}`
  ).subscribe({
    next: (data) => {

      // 🔥 compatible pagination Spring
      if (data.content) {
        this.inscriptions = data.content;
        this.totalPages = data.totalPages;
      } 
      // 🔥 fallback (si jamais backend sans pagination)
      else {
        this.inscriptions = data;
        this.totalPages = 1;
      }

      this.loading = false;
      this.cdr.detectChanges(); // tu peux garder 👍
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

  // 👁️ DETAILS INSCRIPTION (IMPORTANT FIX)
  voirDetails(inscriptionId: number) {
  this.router.navigate(['/gestion-inscriptions', inscriptionId]);
}

  accepter(inscriptionId: number) {

  if (!confirm("Confirmer validation ?")) return;

  // 🔥 optimistic update (instantané)
  this.inscriptions = this.inscriptions.map(i =>
    i.id === inscriptionId ? { ...i, statut: 'ACCEPTEE' } : i
  );

  this.http.put(
    `http://localhost:8080/api/inscriptions/${inscriptionId}/statut?statut=ACCEPTEE`,
    {}
  ).subscribe({
    next: () => {
      // rien à faire (déjà mis à jour)
    },
    error: (err) => {
      console.error("Erreur validation", err);

      // 🔁 rollback si erreur
      this.loadInscriptions();
    }
  });
}


refuser(inscriptionId: number) {

  if (!confirm("Confirmer refus ?")) return;

  // 🔥 optimistic update (instantané)
  this.inscriptions = this.inscriptions.map(i =>
    i.id === inscriptionId ? { ...i, statut: 'REFUSEE' } : i
  );

  this.http.put(
    `http://localhost:8080/api/inscriptions/${inscriptionId}/statut?statut=REFUSEE`,
    {}
  ).subscribe({
    next: () => {
      // rien à faire
    },
    error: (err) => {
      console.error("Erreur refus", err);

      // 🔁 rollback si erreur
      this.loadInscriptions();
    }
  });
}
  trackById(index: number, item: any) {
  return item.id;
}
goBack() {
  window.history.back();
}
nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadInscriptions();
  }
}

prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadInscriptions();
  }
}
}