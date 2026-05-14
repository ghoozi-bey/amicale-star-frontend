import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {CommonModule} from '@angular/common';

import {ActivatedRoute} from '@angular/router';

import {FormsModule} from '@angular/forms';

import {ElectionService} from '../../../../services/election.service';

@Component({
  selector: 'app-attribuer-roles',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './attribuer-roles.html',

  styleUrls:
    ['./attribuer-roles.css']
})
export class AttribuerRoles
implements OnInit {

  electionId!: number;

  winners: any[] = [];

  types: any[] = [];

  loading = true;

  successMessage = '';

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,

    private electionService:
      ElectionService,
    
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    this.electionId =
      Number(
        this.route.snapshot
          .paramMap.get('id')
      );

    this.loadData();
  }

  loadData(): void {

    this.electionService
      .getElectionWinners(
        this.electionId
      )
      .subscribe({

        next: (winners) => {

          this.winners = winners;

          this.electionService
            .getTypeEvenements()
            .subscribe({

              next: (types) => {

                this.types = types;

                this.loading = false;

                this.cdr.detectChanges();
              },

              error: (err) => {

                console.log(err);

                this.loading = false;
                
                this.cdr.detectChanges();
              }
            });
        },

        error: (err) => {

          console.log(err);

          this.errorMessage =
            err.error ||
            'Erreur chargement';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  submit(): void {

    this.errorMessage = '';

    this.successMessage = '';

    const payload =
      this.winners.map(w => ({

        matricule:
          w.matricule,

        typeEvenementId:
          w.typeEvenementId
      }));

    this.electionService
      .attribuerRoles(
        this.electionId,
        payload
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Rôles attribués avec succès';

          this.cdr.detectChanges();
        },

        error: (err) => {

          this.errorMessage =
            err.error ||
            'Erreur attribution';
          
          this.cdr.detectChanges();
        }
      });
  }
}