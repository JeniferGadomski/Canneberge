import { Component } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "./canneberge-api.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Administrateur';

  constructor(private service : CannebergeApiService){}

  getName(){
    return this.service.user.firstname + ' ' + this.service.user.lastname;
  }




}
