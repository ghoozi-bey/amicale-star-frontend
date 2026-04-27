import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SondageService } from '../../services/sondage.service';

@Component({
  selector: 'app-sondage-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sondage-detail.html',
  styleUrls: ['./sondage-detail.css']
})
export class SondageDetailComponent implements OnInit {

  sondage: any;
  loading = true;
  errorMessage = '';

  // store user answers
  responses: any = {};

  constructor(
    private route: ActivatedRoute,
    private sondageService: SondageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSondage(id);
  }

  loadSondage(id: number) {
    this.sondageService.getActiveSondageById(id).subscribe({
      next: (data) => {
        this.sondage = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Impossible de charger le sondage";
        this.loading = false;
      }
    });
  }

  // ===== RESPONSE HANDLING =====

  selectUnique(questionId: number, choixId: number) {
    this.responses[questionId] = choixId;
  }

  toggleMultiple(questionId: number, choixId: number) {
    if (!this.responses[questionId]) {
      this.responses[questionId] = [];
    }

    const index = this.responses[questionId].indexOf(choixId);

    if (index === -1) {
      this.responses[questionId].push(choixId);
    } else {
      this.responses[questionId].splice(index, 1);
    }
  }

  setText(questionId: number, value: string) {
    this.responses[questionId] = value;
  }

  submit() {
    console.log("Responses:", this.responses);
    // 🔥 next step: send to backend
  }
}