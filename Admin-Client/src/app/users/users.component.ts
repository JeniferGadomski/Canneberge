import { Component, OnInit } from '@angular/core';
import {CannebergeApiService} from "../canneberge-api.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
})
export class UsersComponent implements OnInit {

  users: any = [];
  selectedID : string;

  constructor(
    private userService : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router
  )
  { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  isSelected(user : any){
    return this.selectedID === user._id;
  }

  onSelectUser(user : any){
    this.selectedID = user._id;
    this.router.navigate([user._id], {relativeTo : this.route});
  }

}
