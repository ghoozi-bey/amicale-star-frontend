import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SondageService } from '../../services/sondage.service';
import { ParticipationService } from '../../services/participation.service';
import { Answer } from '../../models/participation.model';

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
  successMessage = '';
  errorMessage = '';
  errorMessageSubmit = '';
  isEditing = false;
  isSubmitting = false;
  hasParticipated = false;
  isExpired = false;

  // store user answers
  responses: { [questionId: number]: string | number | number[] } = {};
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sondageService: SondageService,
    private participationService: ParticipationService,
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

        if (data.statut !== 'ACTIF') {
          this.isExpired = true;
        }

        this.loading = false;

        this.loadParticipation(id);

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
    this.clearError();
  }

  toggleMultiple(questionId: number, choixId: number) {

    const current = this.responses[questionId];

    // ensure it's an array
    if (!Array.isArray(current)) {
      this.responses[questionId] = [choixId];
      this.clearError();
      return;
    }

    const index = current.indexOf(choixId);

    if (index === -1) {
      current.push(choixId);
    } else {
      current.splice(index, 1);
    }

    this.clearError();
  }

  setText(questionId: number, value: string) {
    this.responses[questionId] = value;
    this.clearError();
  }

  clearError() {
    this.errorMessageSubmit = '';
  }

  enableEdit() {
    if (this.isExpired) return;

    this.isEditing = true;
    this.errorMessageSubmit = '';
    this.errorMessageSubmit = '';
    this.successMessage = '';
  }

  isCheckedMultiple(questionId: number, choixId: number): boolean {
    const value = this.responses[questionId];
    return Array.isArray(value) && value.includes(choixId);
  }

  isCheckedSingle(questionId: number, choixId: number): boolean {
    return this.responses[questionId] === choixId;
  }

  normalizeType(type: string): 'SINGLE' | 'MULTIPLE' | 'TEXT' {
    if (type === 'CHOIX_UNIQUE') return 'SINGLE';
    if (type === 'CHOIX_MULTIPLE') return 'MULTIPLE';
    if (type === 'TEXTE') return 'TEXT';
    return type as any;
  }

  submit() {

    this.successMessage = '';
    this.errorMessageSubmit = '';

    if (!this.sondage || !this.sondage.questions) {
      return;
    }

    if (this.hasParticipated && !this.isEditing) {
      return;
    }

    if (this.isSubmitting) return;

    // VALIDATION
    const invalid = this.sondage.questions.some((q: any) => {
      const r = this.responses[q.id];

      const isEmpty =
        r === undefined ||
        r === null ||
        (Array.isArray(r) && r.length === 0) ||
        (typeof r === 'string' && r.trim().length === 0);

      if (!q.required && isEmpty) return false;

      if (isEmpty) return true;

      if (r === undefined || r === null) return true;


      const type = this.normalizeType(q.type);
      // TYPE VALIDATION
      if (type === 'TEXT') {
        return typeof r !== 'string' || r.trim().length === 0;
      }

      if (type === 'SINGLE') {
        return typeof r !== 'number';
      }

      if (type === 'MULTIPLE') {
        return !Array.isArray(r) || r.length === 0;
      }

      return true;
    });

    if (invalid) {
      this.errorMessageSubmit = "Veuillez répondre à toutes les questions obligatoires";
      this.successMessage = '';
      return;
    }

    // LOCK SUBMISSION ONLY AFTER VALIDATION
    this.isSubmitting = true;

    // BUILD PAYLOAD
    const answers: Answer[] = this.sondage.questions
    .map((q: any): Answer | null => {

      const r = this.responses[q.id];

      const isEmpty =
        r === undefined ||
        r === null ||
        (Array.isArray(r) && r.length === 0) ||
        (typeof r === 'string' && r.trim().length === 0);

      if (isEmpty && !q.required) return null;

      const type = this.normalizeType(q.type);

      if (type === 'TEXT') {
        return {
          questionId: q.id,
          texte: (r as string).trim()
        };
      }

      if (type === 'MULTIPLE') {
        return {
          questionId: q.id,
          choixIds: r as number[]
        };
      }

      if (type === 'SINGLE') {
        return {
          questionId: q.id,
          choixIds: [r as number]
        };
      }

      return null;
    })
    .filter((a: Answer | null): a is Answer => a !== null);

    const payload = {
      sondageId: this.sondage.id,
      answers
    };

    console.log("Payload:", payload);

    this.participationService.participate(payload).subscribe({
      next: () => {
        this.successMessage = "Participation enregistrée !";
        this.errorMessageSubmit = '';

        this.isSubmitting = false;
        this.isEditing = false;
        this.hasParticipated = true;

        // reload participation to lock UI again
        this.loadParticipation(this.sondage.id);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);

        this.successMessage = '';

        // normalize message first (cleaner)
        const message =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : '');

        // handle expired case
        if (message.includes("n'est pas actif")) {
          this.isExpired = true;
          this.isEditing = false;

          this.errorMessageSubmit = "Ce sondage est terminé, modification impossible";

          this.isSubmitting = false;   // IMPORTANT FIX
          this.cdr.detectChanges();
          return;
        }

        // default error
        this.errorMessageSubmit = message || "Erreur serveur";

        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadParticipation(id: number) {
    this.participationService.getMyParticipation(id).subscribe({
      next: (res) => {

        if (!res.hasParticipated) return;

        this.hasParticipated = true;

        // preload answers
        res.answers.forEach((a: any) => {

          if (a.texte) {
            this.responses[a.questionId] = a.texte;
          } 
          else if (a.choixIds?.length === 1) {
            this.responses[a.questionId] = a.choixIds[0];
          } 
          else {
            this.responses[a.questionId] = a.choixIds;
          }
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}