import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { ElectionService } from '../../../../services/election.service';
import { AdherentLite } from '../../../../models/adherent-lite.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit-election',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit-election.html',
  styleUrls: ['./edit-election.css']
})
export class EditElection implements OnInit {

  form!: FormGroup;

  adherents: AdherentLite[] = [];

  selectedCandidats: string[] = [];

  electionId!: number;

  isLoading = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.electionId =
      Number(this.route.snapshot.paramMap.get('id'));

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
        '',
        Validators.required
      ],

      dateFin: [
        '',
        Validators.required
      ]
    });

    this.loadElection();
    this.loadAdherents();
  }

  // ================= LOAD =================

  loadElection() {

    this.electionService
      .getElectionById(this.electionId)
      .subscribe({

        next: (res: any) => {

          // PRELOAD CANDIDATS
          this.selectedCandidats =
            res.candidats || [];

          this.form.patchValue({

            title: res.title,

            description: res.description,

            dateDebut:
              res.dateDebut?.slice(0,16),

            dateFin:
              res.dateFin?.slice(0,16)
          });
        },

        error: (err) => {

          console.log(err);
        }
      });
  }

  loadAdherents() {

    this.userService
      .getAllLite()
      .subscribe({

        next: (data) => {

          this.adherents = data.filter(a => a.role !== 'RESPONSABLE_ELECTION');

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  get availableUsers(): AdherentLite[] {

    return this.adherents.filter(
      a => !this.selectedCandidats.includes(
        a.matricule
      )
    );
  }

  get selectedUsers(): AdherentLite[] {

    return this.adherents.filter(
      a => this.selectedCandidats.includes(
        a.matricule
      )
    );
  }

  addCandidat(matricule: string) {

    if(
      !this.selectedCandidats.includes(
        matricule
      )
    ) {

      this.selectedCandidats.push(
        matricule
      );
    }
  }

  removeCandidat(matricule: string) {

    this.selectedCandidats =
      this.selectedCandidats.filter(
        m => m !== matricule
      );
  }

  // ================= SUBMIT =================

  onSubmit() {

    this.form.markAllAsTouched();

    this.successMessage = '';

    this.errorMessage = '';

    this.form.get('dateDebut')
    ?.setErrors(null);

    this.form.get('dateFin')
      ?.setErrors(null);

    this.form.get('dateDebut')
      ?.updateValueAndValidity();

    this.form.get('dateFin')
      ?.updateValueAndValidity();

    if(this.form.invalid) {

      this.errorMessage =
        'Formulaire invalide';

      return;
    }

    const debut =
      new Date(this.form.value.dateDebut);

    const fin =
      new Date(this.form.value.dateFin);

    // ===== DATE >= TOMORROW =====

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    tomorrow.setHours(0,0,0,0);

    if (debut < tomorrow) {

      this.form.get('dateDebut')
        ?.setErrors({ tooEarly: true });

      this.errorMessage =
        'La date début doit être à partir de demain';

      return;
    }

    if(debut >= fin) {

      this.form.get('dateDebut')
        ?.setErrors({ invalidDate: true });

      this.form.get('dateFin')
        ?.setErrors({ invalidDate: true });

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

    this.electionService
      .updateElection(
        this.electionId,
        payload
      )
      .subscribe({

        next: () => {

          this.isLoading = false;

          this.successMessage =
            '✅ Election modifiée avec succès';

          setTimeout(() => {

            window.location.reload();

          }, 1200);
        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            '❌ Erreur serveur';

          console.log(err.error);
        }
      });
  }
}