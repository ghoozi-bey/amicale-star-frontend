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
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef // 🔥 IMPORTANT
  ) {}

  ngOnInit(): void {
    this.inscriptionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetails();
  }

  loadDetails() {
    this.loading = true;

    this.http.get(`http://localhost:8080/api/inscriptions/${this.inscriptionId}/full`)
      .subscribe({
        next: (res) => {
          console.log("DATA =", res);

          this.data = res;
          this.loading = false;

          this.cd.detectChanges(); // 🔥 FIX DOUBLE CLICK
        },
        error: (err) => {
          console.error(err);
          this.loading = false;

          this.cd.detectChanges(); // 🔥 IMPORTANT
        }
      });
  }

  openPdf(base64: string) {
    if (!base64) return;

    const url = "data:application/pdf;base64," + base64;
    window.open(url, "_blank");
  }

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
        console.log("Statut mis à jour");

        this.data.statut = statut;

        this.cd.detectChanges(); // 🔥 FIX DOUBLE CLICK
      },
      error: (err) => {
        console.error("Erreur update statut", err);
      }
    });
  }
}