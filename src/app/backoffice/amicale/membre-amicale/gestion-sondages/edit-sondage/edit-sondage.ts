import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SondageService } from '../../../../../services/sondage.service';
import { Sondage } from '../../../../../models/sondage.model';

@Component({
  selector: 'app-edit-sondage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-sondage.html',
  styleUrl: './edit-sondage.css',
})
export class EditSondageComponent implements OnInit {

  form!: FormGroup;
  sondageId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sondageService: SondageService,
    private router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.sondageId = Number(idParam);

    this.initForm();       // ✅ create form
    this.loadSondage();    // ✅ load + patch data
  }

  // =========================
  // FORM INIT
  // =========================
  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      questions: this.fb.array([])
    }, {
      validators: this.dateValidator
    });
  }

  // =========================
  // DATE VALIDATION
  // =========================
  dateValidator(group: FormGroup) {
    const debut = group.get('dateDebut')?.value;
    const fin = group.get('dateFin')?.value;

    if (debut && fin && debut > fin) {
      return { invalidDate: true };
    }
    return null;
  }

  // =========================
  // LOAD DATA
  // =========================
  loadSondage() {
    this.sondageService.getById(this.sondageId).subscribe({
      next: (data: Sondage) => {

        // ✅ fill main fields
        this.form.patchValue({
          title: data.title,
          description: data.description,
          dateDebut: data.dateDebut?.slice(0, 16),
          dateFin: data.dateFin?.slice(0, 16)
        });

        // ✅ clear + rebuild questions
        this.questions.clear();

        data.questions.forEach((q) => {
          this.questions.push(this.createQuestion(q));
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // =========================
  // QUESTIONS
  // =========================
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  createQuestion(q?: any): FormGroup {
    return this.fb.group({
      text: [q?.text || '', Validators.required],
      type: [q?.type || 'CHOIX_UNIQUE', Validators.required],
      choix: this.fb.array(
        q?.type === 'TEXTE'
          ? []
          : (q?.choixList || []).map((c: any) =>
              this.fb.control(c.label, Validators.required)
            )
      )
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // =========================
  // CHOICES
  // =========================
  getChoixArray(qIndex: number): FormArray {
    return this.questions.at(qIndex).get('choix') as FormArray;
  }

  addChoix(qIndex: number) {
    this.getChoixArray(qIndex).push(this.fb.control('', Validators.required));
  }

  removeChoix(qIndex: number, cIndex: number) {
    this.getChoixArray(qIndex).removeAt(cIndex);
  }

  // =========================
  // SUBMIT
  // =========================
  onSubmit() {
    if (this.form.invalid) return;

    this.sondageService.update(this.sondageId, this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/gestion-sondages']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onTypeChange(index: number) {
    const question = this.questions.at(index);
    const type = question.get('type')?.value;

    const choixArray = this.getChoixArray(index);

    if (type === 'TEXTE') {
      choixArray.clear(); // remove choices
    } else if (choixArray.length === 0) {
      choixArray.push(this.fb.control('', Validators.required));
    }
  }
  
}