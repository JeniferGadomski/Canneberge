import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CannebergeApiService} from "../canneberge-api.service";
import {User} from "./users";
declare var swal: any;

@Component({
  templateUrl: 'users-detail.component.html',
  styleUrls: ['users.component.css']
})
export class UsersDetailComponent implements OnInit {

  user: User;
  private currentId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CannebergeApiService
  )
  { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentId  = params['id'];
      // Retrieve Pet with Id route param
      this.service.getUser(this.currentId).subscribe(user => this.user = user);
      console.log(this.user);
    });
  }

  returnUsersList()
  {
    this.router.navigate(['/utilisateurs']);
  }

  saveUser(user){
    this.service.saveUser(this.currentId, user).subscribe(
      res => {console.log('success');}
    );
    this.returnUsersList();
  }

  deleteUser(){
    var r = confirm("Voulez-vous vraiment supprimer un utilisateur");
    if (r) {
      this.service.deleteUser(this.currentId).subscribe(
        res => {console.log('success');}
      );
      this.returnUsersList()
    }

  }



}
