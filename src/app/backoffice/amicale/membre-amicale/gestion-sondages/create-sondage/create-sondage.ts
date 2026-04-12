import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-sondage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-sondage.html',
  styleUrl: './create-sondage.css',
})
export class CreateSondageComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      questions: this.fb.array([])
    });
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
    if (this.form.invalid) {
      console.log('Form invalid');
      return;
    }

    const payload = this.form.value;

    console.log('Sondage payload:', payload);

    // 🔥 later:
    // this.sondageService.createSondage(payload).subscribe(...)
  }
}