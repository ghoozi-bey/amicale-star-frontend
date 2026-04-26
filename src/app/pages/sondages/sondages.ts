import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SondageService } from '../../services/sondage.service';

@Component({
  selector: 'app-sondages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sondages.html',
  styleUrls: ['./sondages.css']
})
export class SondagesComponent implements OnInit {

  sondages: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private sondageService: SondageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSondages();
  }

  loadSondages() {
    this.loading = true;

    this.sondageService.getActiveSondages().subscribe({
      next: (data) => {
        this.sondages = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des sondages';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openSondage(id: number) {
    this.router.navigate(['/sondages', id]);
  }
}