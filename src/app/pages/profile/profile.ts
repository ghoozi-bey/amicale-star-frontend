import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  profile:any = {
    email:'',
    telephone:'',
    motdepasse:''
  };

  constructor(private userService:UserService){}

  ngOnInit(){

  this.userService.getProfile().subscribe((data:any)=>{

    console.log("DONNEES API :", data);

    this.profile = data;

});

}

update(){

    this.userService.updateProfile(this.profile)
    .subscribe(()=>{
      alert("Profil modifié");
    });

  }

}