import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import { ElectionService }
from '../../services/election.service';

import { ElectionPublic }
from '../../models/election-public.model';

import { VoteService }
from '../../services/vote.service';
import { VoteRequest } from '../../models/vote-request.model';

@Component({
  selector: 'app-election-detail-public',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './election-detail-public.html',

  styleUrl: './election-detail-public.css',
})
export class ElectionDetailPublic
implements OnInit {

  election?: ElectionPublic;

  loading = true;

  hasVoted = false;

  selectedCandidats: number[] = [];

  submitting = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private electionService:
      ElectionService,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadElection(id);

    this.loadVoteState(id);
  }

  loadElection(id: number): void {

    this.electionService
      .getActiveElectionById(id)
      .subscribe({

        next: (res) => {

          this.election = res;

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.loading = false;
          this.cdr.detectChanges();
        }

      });
  }

  toggleCandidate(candidatId: number): void {

    if (!this.election) return;

    if (this.hasVoted) return;

    const max =
      this.election.nombreGagnants || 1;

    const alreadySelected =
      this.selectedCandidats.includes(
        candidatId
      );

    // unselect
    if (alreadySelected) {

      this.selectedCandidats =
        this.selectedCandidats.filter(
          id => id !== candidatId
        );

      return;
    }

    // max reached
    if (
      this.selectedCandidats.length >= max
    ) {

      return;
    }

    this.selectedCandidats.push(
      candidatId
    );
  }

  submitVote(): void {

    if (!this.election) return;

    if (this.hasVoted) return;

    this.errorMessage = '';

    this.successMessage = '';

    if (
      this.selectedCandidats.length === 0
    ) {

      this.errorMessage =
        'Sélectionnez au moins un candidat';

      return;
    }

    const confirmed = confirm(
      'Votre vote est définitif et ne pourra plus être modifié. Voulez-vous continuer ?'
    );

    if (!confirmed) {
      return;
    }

    this.submitting = true;

    const payload : VoteRequest = {

      electionId: this.election.id!,

      candidatIds:
        this.selectedCandidats
    };

    this.voteService
      .voter(payload)
      .subscribe({

        next: () => {

          this.successMessage =
            'Vote enregistré avec succès';

          this.submitting = false;

          this.cdr.detectChanges();

          setTimeout(() => {

            this.hasVoted = true;

            this.cdr.detectChanges();

          }, 5000);
        },

        error: (err) => {

          console.error(err);

          if (typeof err.error === 'string') {

            this.errorMessage = err.error;

          } else if (err.error?.message) {

            this.errorMessage = err.error.message;

          } else if (err.error?.error) {

            this.errorMessage = err.error.error;

          } else {

            this.errorMessage =
              'Une erreur est survenue';
          }

          this.submitting = false;

          this.cdr.detectChanges();
        }

      });
  }

  loadVoteState(
    electionId: number
  ): void {

    this.voteService
      .hasVoted(electionId)
      .subscribe({

        next: (res) => {

          this.hasVoted = res;
        },

        error: (err) => {

          console.error(err);
        }

      });
  }

}