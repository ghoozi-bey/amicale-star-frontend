import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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
    private router: Router,
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

    this.successMessage = '';

    this.errorMessage = '';

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

          this.errorMessage =
            err.error?.message ||
            'Erreur lors de la publication';

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  unpublishElection() {

    this.successMessage = '';

    this.errorMessage = '';

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

          this.errorMessage =
            err.error?.message ||
            'Erreur lors de l’annulation de publication';

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  rejectElection() {

    const confirmed = confirm(
      'Cette action est irréversible. Êtes-vous sûr de vouloir rejeter cette élection ?'
    );

    if(!confirmed) {
      return;
    }

    this.successMessage = '';

    this.errorMessage = '';

    this.electionService
      .rejectElection(this.election.id!)
      .subscribe({

        next: () => {

          this.successMessage =
            'Election rejetée avec succès';

          this.cdr.detectChanges();

          setTimeout(() => {

            window.location.reload();

          }, 1500);
        },

        error: (err) => {

          this.errorMessage =
            err.error?.message ||
            'Erreur lors du rejet';

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  deleteElection() {

    const confirmed = confirm(
      'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette élection ?'
    );

    if(!confirmed) {
      return;
    }

    this.successMessage = '';

    this.errorMessage = '';

    this.electionService
      .deleteElection(this.election.id!)
      .subscribe({

        next: () => {

          this.successMessage =
            'Election supprimée avec succès';

          this.cdr.detectChanges();

          setTimeout(() => {

            this.router.navigate([
              '/gestion-election'
            ]);

          }, 1500);
        },

        error: (err) => {

          this.errorMessage =
            err.error?.message ||
            'Erreur lors de la suppression';

          console.log(err);

          this.cdr.detectChanges();
        }
      });
  }

  goToStats() {

    this.router.navigate([
      '/gestion-election',
      this.election.id,
      'stats'
    ]);
  }

}