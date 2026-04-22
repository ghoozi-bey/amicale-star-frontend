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
    this.inscriptions = this.inscriptions.map(i =>
      i.id === inscriptionId ? { ...i, statut: 'ACCEPTEE' } : i
    );
  }

  refuser(inscriptionId: number) {
    this.inscriptions = this.inscriptions.map(i =>
      i.id === inscriptionId ? { ...i, statut: 'REFUSEE' } : i
    );
  }
}