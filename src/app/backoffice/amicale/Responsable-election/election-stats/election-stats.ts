import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute
} from '@angular/router';

import { ElectionService }
from '../../../../services/election.service';

@Component({
  selector: 'app-election-stats',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './election-stats.html',

  styleUrl: './election-stats.css'
})
export class ElectionStats
implements OnInit {

  stats: any[] = [];

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.electionService
      .getElectionStats(id)
      .subscribe({

        next: (res) => {

          this.stats = res;

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {

          console.log(err);

          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  get totalVotes(): number {

    return this.stats.reduce(
      (sum, s) => sum + s.votes,
      0
    );
  }

  getPercentage(votes: number): number {

    if (this.totalVotes === 0) {
      return 0;
    }

    return Math.round(
      (votes / this.totalVotes) * 100
    );
  }
}