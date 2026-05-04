import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ElectionService } from '../../../../services/election.service';

import { Election } from '../../../../models/election.model';

@Component({
  selector: 'app-list-elections',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-elections.html',
  styleUrls: ['./list-elections.css']
})
export class ListElections implements OnInit {

  elections: Election[] = [];

  loading = true;

  errorMessage = '';

  constructor(
    private electionService: ElectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadElections();
  }

  loadElections(): void {

    this.loading = true;

    this.electionService.getAllElections()
      .subscribe({

        next: (data) => {

          this.elections = data;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          this.errorMessage =
            'Erreur lors du chargement';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }
}