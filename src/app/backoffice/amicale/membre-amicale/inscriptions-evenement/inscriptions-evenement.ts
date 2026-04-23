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

    this.http.get<any[]>(`http://localhost:8080/api/inscriptions/event/${this.eventId}`)
      .subscribe({
        next: (data) => {
          this.inscriptions = data;
          this.loading = false;
          this.cdr.detectChanges(); // 🔥
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

  // ✅ UI ONLY (temporaire)
  accepter(inscriptionId: number) {

  if (!confirm("Confirmer validation ?")) return;

  this.http.put(
    `http://localhost:8080/api/inscriptions/${inscriptionId}/statut?statut=ACCEPTEE`,
    {}
  ).subscribe({
    next: () => {

      // 🔥 update UI direct
      const insc = this.inscriptions.find(i => i.id === inscriptionId);
      if (insc) insc.statut = 'ACCEPTEE';

      this.inscriptions = [...this.inscriptions]; // refresh Angular
    },
    error: (err) => {
      console.error("Erreur validation", err);
    }
  });
}


refuser(inscriptionId: number) {

  if (!confirm("Confirmer refus ?")) return;

  this.http.put(
    `http://localhost:8080/api/inscriptions/${inscriptionId}/statut?statut=REFUSEE`,
    {}
  ).subscribe({
    next: () => {

      // 🔥 update UI direct
      const insc = this.inscriptions.find(i => i.id === inscriptionId);
      if (insc) insc.statut = 'REFUSEE';

      this.inscriptions = [...this.inscriptions]; // refresh Angular
    },
    error: (err) => {
      console.error("Erreur refus", err);
    }
  });
}
  trackById(index: number, item: any) {
  return item.id;
}
}