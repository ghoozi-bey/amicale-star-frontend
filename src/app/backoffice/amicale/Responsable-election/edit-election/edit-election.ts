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

      nombreCandidats: [
        2,
        [
          Validators.required,
          Validators.min(2)
        ]
      ],

      nombreGagnants: [
        1,
        [
          Validators.required,
          Validators.min(1)
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

            nombreCandidats: res.nombreCandidats,

            nombreGagnants: res.nombreGagnants,

            dateDebut:
              res.dateDebut?.slice(0,16),

            dateFin:
              res.dateFin?.slice(0,16)
          });

          this.cdr.detectChanges();
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

    if( !this.selectedCandidats.includes(matricule)) {

      if(this.selectedCandidats.length >= this.form.value.nombreCandidats) {

        this.form.get('nombreCandidats')
          ?.setErrors({
            maxReached: true
          });

        this.form.get('nombreCandidats')
          ?.markAsTouched();

        return;
      }

      this.errorMessage = '';

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

  onMaxCandidatesChange() {

    const max =
      this.form.value.nombreCandidats;

    if (
      this.selectedCandidats.length > max
    ) {

      this.form.patchValue({
        nombreCandidats:
          this.selectedCandidats.length
      });

      setTimeout(() => {

        this.form.get('nombreCandidats')
          ?.setErrors({
            tooSmall: true
          });

        this.form.get('nombreCandidats')
          ?.markAsTouched();

      });
    }
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
        'Veuillez corriger les erreurs du formulaire';

      return;
    }

    const debut =
      new Date(this.form.value.dateDebut);

    const fin =
      new Date(this.form.value.dateFin);

    const nombreCandidats =
      this.form.value.nombreCandidats;

    const nombreGagnants =
      this.form.value.nombreGagnants;

    // ===== DATE >= TOMORROW =====

    const now = new Date();

    if (debut <= now) {

      this.form.get('dateDebut')
        ?.setErrors({ pastDate: true });

      return;
    }

    if(debut >= fin) {

      this.form.get('dateDebut')
        ?.setErrors({ invalidDate: true });

      this.form.get('dateFin')
        ?.setErrors({ invalidDate: true });

      return;
    }

    // WINNERS > MAX
    if(nombreGagnants >= nombreCandidats) {

      this.form.get('nombreGagnants')
        ?.setErrors({
          tooManyWinners: true
        });

      this.errorMessage =
        'Nombre de gagnants invalide';

      return;
    }

    // TOO MANY SELECTED
    if(this.selectedCandidats.length > nombreCandidats) {

      this.errorMessage =
        'Le nombre de candidats dépasse la limite autorisée';

      return;
    }

    const payload = {

      title: this.form.value.title,

      description: this.form.value.description,

      nombreCandidats:
        this.form.value.nombreCandidats,

      nombreGagnants:
        this.form.value.nombreGagnants,

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

            this.loadElection();


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