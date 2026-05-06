import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ElectionService } from '../../../../services/election.service';
import { AdherentLite } from '../../../../models/adherent-lite.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-create-election',
  standalone: true,
  templateUrl: './create-election.html',
  styleUrls: ['./create-election.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateElection implements OnInit{

  form: FormGroup;

  adherents: AdherentLite[] = [];

  selectedCandidats: string[] = [];

  successMessage = '';

  errorMessage = '';

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService,
    private userService: UserService
  ) {

    const defaultDates = this.initDefaultDates();

    this.form = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000)
        ]
      ],

      dateDebut: [
        defaultDates.dateDebut,
        Validators.required
      ],

      dateFin: [
        defaultDates.dateFin,
        Validators.required
      ]
    });
  }

  ngOnInit(): void {

    this.loadAdherents();
  }

  // ================= DATES =================

  initDefaultDates() {

    const now = new Date();

    const tomorrow = new Date();

    const nextMonth = new Date();

    tomorrow.setDate(now.getDate() + 1);

    nextMonth.setDate(now.getDate() + 1);

    nextMonth.setMonth(now.getMonth() + 1);

    // debut -> 08:00
    const dateDebut = new Date(tomorrow);

    dateDebut.setHours(7, 0, 0, 0);

    // fin -> 18:00
    const dateFin = new Date(nextMonth);

    dateFin.setHours(18, 0, 0, 0);

    return {
      dateDebut: this.formatDate(dateDebut),
      dateFin: this.formatDate(dateFin)
    };
  }

  formatDate(date: Date): string {

    const pad = (n: number) =>
      n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  loadAdherents() {

    this.userService
      .getAllLite()
      .subscribe({

        next: (data) => {

          this.adherents = data;
        },

        error: (err) => {

          console.log(err);
        }
      });
  }

  // ================= SUBMIT =================

  onSubmit(): void {

    this.form.markAllAsTouched();

    this.successMessage = '';
    this.errorMessage = '';

    // CLEAR OLD CUSTOM ERRORS
    this.form.get('dateDebut')
      ?.setErrors(null);

    this.form.get('dateFin')
      ?.setErrors(null);

    // REVALIDATE
    this.form.get('dateDebut')
      ?.updateValueAndValidity();

    this.form.get('dateFin')
      ?.updateValueAndValidity();

    const debut =
      new Date(this.form.value.dateDebut);

    const fin =
      new Date(this.form.value.dateFin);

    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    tomorrow.setHours(0,0,0,0);

    let hasError = false;

    // DATE LOGIC
    if (debut >= fin) {

      this.form.get('dateDebut')
        ?.setErrors({ invalidDate: true });

      this.form.get('dateFin')
        ?.setErrors({ invalidDate: true });

      hasError = true;
    }

    // DATE >= TOMORROW
    if (debut < tomorrow) {

      this.form.get('dateDebut')
        ?.setErrors({ tooEarly: true });

      hasError = true;
    }

    // GLOBAL VALIDATION
    if (this.form.invalid || hasError) {

      this.errorMessage =
        'Veuillez corriger les erreurs du formulaire';

      return;
    }

    const payload = {

      title: this.form.value.title,

      description: this.form.value.description,

      dateDebut:
        this.form.value.dateDebut + ':00',

      dateFin:
        this.form.value.dateFin + ':00',

      candidats:
        this.selectedCandidats
    };

    this.isLoading = true;

    this.electionService.createElection(payload)
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.successMessage =
            '✅ Election créée avec succès';

          const defaultDates =
            this.initDefaultDates();

          this.form.reset({

            title: '',

            description: '',

            dateDebut:
              defaultDates.dateDebut,

            dateFin:
              defaultDates.dateFin
          });

          this.form.markAsUntouched();
        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            '❌ Erreur serveur';

          console.log(err);
        }
      });
  }
}