import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";

@Component({
  selector: 'app-fermes',
  templateUrl: './fermes.component.html',
  styleUrls: ['./fermes.component.css', '../users/users.component.css']
})
export class FermesComponent implements OnInit {

  fermes: any = [];
  selectedFerme : any;

  constructor(
    private cannebergeApiService : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router
  )
  { }

  ngOnInit() {
    this.cannebergeApiService.getFermes().subscribe(fermes => {
      this.fermes = fermes;
    });
  }

  ngAfterViewInit(){

  }

  getFerme(ferme : any){
    this.router.navigate(['/fermes', ferme._id]);
  }

  isSelected(user : any){
    return this.selectedFerme === user._id;
  }

  onSelectFerme(ferme : any){
    this.selectedFerme = ferme;
    this.router.navigate([ferme._id], {relativeTo : this.route});
  }

  getShapefile(ferme){
    console.log('component getShapefile');
    this.cannebergeApiService.getFerme(ferme._id)
      .subscribe(resFerme => {
        this.cannebergeApiService.getShapefile(resFerme.geojson);
      });


  }



}
