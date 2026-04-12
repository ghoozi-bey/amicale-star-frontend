import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent {

  eventId!: number;

  constructor(private route: ActivatedRoute) {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
  }
}