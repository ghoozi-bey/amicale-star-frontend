import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private sondageService: SondageService,
    private cdr: ChangeDetectorRef
  ) {
    const defaultDates = this.initDefaultDates();

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dateDebut: [defaultDates.dateDebut, Validators.required],
      dateFin: [defaultDates.dateFin, Validators.required],
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

  // ================= DATES Init Logic =================
  initDefaultDates() {
    const now = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    // Début → 00:00
    const dateDebut = new Date(tomorrow);
    dateDebut.setHours(0, 0, 0, 0);

    // Fin → 17:00
    const dateFin = new Date(tomorrow);
    dateFin.setHours(17, 0, 0, 0);

    return {
      dateDebut: this.formatDateForInput(dateDebut),
      dateFin: this.formatDateForInput(dateFin)
    };
  }

  formatDateForInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // ================= QUESTION =================

  addQuestion() {
    const question = this.fb.group({
      text: ['', Validators.required],
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

    this.form.markAllAsTouched(); // 🔥 VERY IMPORTANT

    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.errorMessage = 'Formulaire invalide';
      return;
    }

    if (this.questions.length === 0) {
      this.errorMessage = 'Ajoutez au moins une question';
      return;
    }

    // 🔥 VALIDATE QUESTIONS PROPERLY
    for (let i = 0; i < this.questions.length; i++) {

      const qControl = this.questions.at(i) as FormGroup;
      const q = qControl.value;

      if (!q.text) {
        this.errorMessage = 'Chaque question doit avoir un texte';
        return;
      }

      if (q.type !== 'TEXTE') {

        const choixArray = this.getChoix(i);

        // mark all choices as touched
        choixArray.controls.forEach(c => c.markAsTouched());

        const validChoices = q.choix.filter((c: string) => c.trim() !== '');

        if (validChoices.length < 2) {
          this.errorMessage = 'Chaque question doit avoir au moins 2 choix valides';
          return;
        }
      }
    }

    // 🔥 DATE VALIDATION (WITH VISUAL ERROR)
    if (this.form.value.dateDebut >= this.form.value.dateFin) {
      this.form.get('dateDebut')?.setErrors({ invalidDate: true });
      this.form.get('dateFin')?.setErrors({ invalidDate: true });

      this.errorMessage = 'Date début doit être avant date fin';
      return;
    }

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0,0,0,0);

    const dateDebut = new Date(this.form.value.dateDebut);

    if (dateDebut < tomorrow) {
      this.form.get('dateDebut')?.setErrors({ tooEarly: true });
      this.errorMessage = 'La date de début doit être à partir de demain';
      return;
    }

    const raw = this.form.value;

    const payload = {
      title: raw.title,
      description: raw.description,
      dateDebut: raw.dateDebut ? raw.dateDebut + ':00' : null,
      dateFin: raw.dateFin ? raw.dateFin + ':00' : null,
      questions: raw.questions.map((q: any) => ({
        text: q.text,
        type: q.type,
        choix: q.type === 'TEXTE'
          ? []
          : q.choix.filter((c: string) => c.trim() !== '')
      }))
    };

    this.isLoading = true;

    this.sondageService.create(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = '✅ Sondage créé avec succès';
        this.cdr.detectChanges(); // forces UI update

        setTimeout(() => {
          const defaultDates = this.initDefaultDates();

          this.form.reset({
            title: '',
            description: '',
            dateDebut: defaultDates.dateDebut,
            dateFin: defaultDates.dateFin
          });

          this.form.markAsUntouched();

          this.form.setControl('questions', this.fb.array([]));
          this.addQuestion();

          this.successMessage = '';
        }, 2000);
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || '❌ Erreur serveur';
        this.cdr.detectChanges(); // forces UI update
      }
    });
  }
}