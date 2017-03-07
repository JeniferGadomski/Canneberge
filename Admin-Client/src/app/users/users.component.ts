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
    private service : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router
  )
  { }

  ngOnInit() {
    this.service.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnChanges(){
    console.log('change utilisatatuers');
    this.service.getUsers().subscribe(users => {
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
