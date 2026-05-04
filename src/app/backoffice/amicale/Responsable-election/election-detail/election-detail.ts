import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { ElectionService } from '../../../../services/election.service';

import { Election } from '../../../../models/election.model';

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './election-detail.html',
  styleUrls: ['./election-detail.css']
})
export class ElectionDetail implements OnInit {

  election!: Election;

  loading = true;

  successMessage = '';

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id =
      Number(this.route.snapshot.paramMap.get('id'));

    this.electionService.getElectionById(id)
      .subscribe({

        next: (data) => {

          this.election = data;

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  publishElection() {

    this.electionService
      .publishElection(this.election.id!)
      .subscribe({

        next: () => {

          this.successMessage =
            'Election publiée avec succès';

          this.cdr.detectChanges();

          setTimeout(() => {

            window.location.reload();

          }, 1500);
        },

        error: (err) => {

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  unpublishElection() {

    this.electionService
      .unpublishElection(this.election.id!)
      .subscribe({

        next: () => {

          this.successMessage =
            'Election dépubliée avec succès';

          this.cdr.detectChanges();

          setTimeout(() => {

            window.location.reload();

          }, 1500);
        },

        error: (err) => {

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  goToStats() {

  }

  deleteElection() {

  }
}