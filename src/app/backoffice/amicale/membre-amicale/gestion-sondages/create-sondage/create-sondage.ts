import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SondageService } from '../../../../../services/sondage.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-create-sondage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-sondage.html',
  styleUrl: './create-sondage.css',
})
export class CreateSondageComponent {

  form: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private sondageService: SondageService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      dateDebut: [''],
      dateFin: [''],
      questions: this.fb.array([])
    });

    this.addQuestion();
  }

  // ================= GETTERS =================

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  getChoix(i: number): FormArray {
    return this.questions.at(i).get('choix') as FormArray;
  }

  // ================= QUESTION =================

  addQuestion() {
    const question = this.fb.group({
      text: [''],
      type: ['CHOIX_UNIQUE'],
      choix: this.fb.array([
        this.fb.control(''),
        this.fb.control('')
      ])
    });

    this.questions.push(question);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // ================= CHOICES =================

  addChoice(i: number) {
    this.getChoix(i).push(this.fb.control(''));
  }

  removeChoice(i: number, j: number) {
    this.getChoix(i).removeAt(j);
  }

  // ================= TYPE CHANGE =================

  onTypeChange(i: number) {
    const q = this.questions.at(i) as FormGroup;
    const type = q.get('type')?.value;

    if (type === 'TEXTE') {
      q.setControl('choix', this.fb.array([]));
    } else {
      const choix = q.get('choix') as FormArray;

      if (!choix || choix.length === 0) {
        q.setControl('choix', this.fb.array([
          this.fb.control(''),
          this.fb.control('')
        ]));
      }
    }
  }

  // ================= SUBMIT =================

  onSubmit() {
    // reset messages first
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = '❌ Formulaire invalide';
      return;
    }

    const raw = this.form.value;

    const payload = {
      ...raw,
      dateDebut: raw.dateDebut ? raw.dateDebut + ':00' : null,
      dateFin: raw.dateFin ? raw.dateFin + ':00' : null
    };

    console.log('Sending:', payload);

    this.sondageService.create(payload).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = '✅ Sondage créé avec succès';
        this.cdr.detectChanges();

        // wait 3s then reset cleanly
        setTimeout(() => {
          this.form.reset();

          // IMPORTANT: reinitialize questions properly
          this.form.setControl('questions', this.fb.array([]));
          this.addQuestion();

          this.successMessage = '';
        }, 3000);
      },

      error: (err) => {
        console.error(err);
        this.successMessage = '';
        this.errorMessage = '❌ Erreur lors de la création';
        this.cdr.detectChanges();
      }
    });
  }
}