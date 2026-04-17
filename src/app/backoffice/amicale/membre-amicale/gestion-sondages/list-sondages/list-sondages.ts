import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SondageService } from '../../../../../services/sondage.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-list-sondages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-sondages.html',
  styleUrl: './list-sondages.css'
})

export class ListSondagesComponent implements OnInit {

  sondages: any[] = [];
  loading = true;

  constructor(private sondageService: SondageService,
              private cdr: ChangeDetectorRef,
              private router: Router
              ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.sondageService.getMySondages().subscribe({
      next: (data) => {
        this.sondages = data;
        this.loading = false;
        this.cdr.detectChanges(); // forces UI update
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    if (confirm('Supprimer ce sondage ?')) {
      this.sondageService.delete(id).subscribe(() => this.load());
    }
  }

  publish(id: number) {
    this.sondageService.publish(id).subscribe(() => this.load());
  }

  goToDetails(sondage: any) {
    this.router.navigate(['/gestion-sondages', sondage.id]);
  }

  formatStatus(statut: string): string {
    const map: any = {
      BROUILLON: 'Brouillon',
      PUBLISHED: 'Publié',
      REJECTED: 'Rejeté',
      ACTIF: 'Actif',
      TERMINE: 'Terminé'
    };

    return map[statut] || statut;
  }

}