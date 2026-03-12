import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvenementService } from '../../services/evenement';

@Component({
selector: 'app-dashboard',
standalone: true,
imports: [CommonModule],
templateUrl: './dashboard.html',
styleUrls: ['./dashboard.css']
})


export class DashboardComponent implements OnInit {

evenements:any=[];

constructor(
private evenementService:EvenementService,
private cd:ChangeDetectorRef
){}

ngOnInit(){

this.loadEvenements();

}

loadEvenements(){

this.evenementService.getEvenements().subscribe(data=>{

this.evenements = data;

this.cd.detectChanges();

});

}
selectedEvent:any=null;

openDetails(e:any){
this.selectedEvent=e;
}

closeDetails(){
this.selectedEvent=null;
}

}
