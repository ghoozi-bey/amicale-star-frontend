import { Component, OnInit } from '@angular/core';
import { SondageService } from '../../../../../services/sondage.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-sondages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-sondages.html',
  styleUrl: './list-sondages.css'
})
export class ListSondagesComponent implements OnInit {

  sondages: any[] = [];

  constructor(private sondageService: SondageService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.sondageService.getAll().subscribe(data => {
      this.sondages = data;
    });
  }

  delete(id: number) {
    if (confirm('Supprimer ce sondage ?')) {
      this.sondageService.delete(id).subscribe(() => this.load());
    }
  }

  publish(id: number) {
    this.sondageService.publish(id).subscribe(() => this.load());
  }
}