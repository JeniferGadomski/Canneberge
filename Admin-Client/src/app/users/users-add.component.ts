import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CannebergeApiService} from "../canneberge-api.service";
import {User} from "./users";
declare var swal: any;

@Component({
  templateUrl: 'users-add.component.html',
  styleUrls: ['users.component.css']
})
export class UsersAddComponent implements OnInit {

  user: User;

  constructor(
    private userService : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router
  )
  { }

  ngOnInit() {
    this.user = {
      firstname : '',
      lastname: '',
      email: '',
      username: '',
      admin: false
    }
  }

  returnUsersList()
  {
    this.router.navigate(['/utilisateurs']);
  }

  saveNewUser(){
    this.userService.saveNewUser(this.user).subscribe(
      res => {this.popAlert(res);}
    );

  }

  popAlert(saveMessage){
    console.log(saveMessage);
    if(saveMessage.success) {
      swal({
        title: "Sauvegarder!",
        type: "success"
      });
      this.returnUsersList();
    }
    else{
      swal({
        title : "Problème",
        text: saveMessage.message,
        type :"error"
      });
    }
  }




}
