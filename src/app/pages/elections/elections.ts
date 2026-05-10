import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { ElectionService }
from '../../services/election.service';

import { ElectionPublic }
from '../../models/election-public.model';

@Component({
  selector: 'app-elections',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './elections.html',

  styleUrl: './elections.css',
})
export class Elections
implements OnInit {

  elections: ElectionPublic[] = [];

  loading = true;

  constructor(
    private electionService:
      ElectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadElections();
  }

  loadElections(): void {

    this.electionService
      .getActiveElections()
      .subscribe({

        next: (res) => {

          this.elections = res;

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
}