import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CannebergeApiService} from "../canneberge-api.service";
declare var swal: any;

@Component({
  templateUrl: 'fermes-detail.component.html',
  styleUrls: ['../users/users.component.css']
})
export class FermesDetailComponent implements OnInit {

  ferme : any;
  listFile : File[];
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
      this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
      console.log(this.ferme);
    });
  }

  returnFermeList(){
    this.router.navigate(['/fermes']);
  }

  saveFerme(){
    this.service.saveFerme(this.currentId, this.ferme).subscribe(
      res => {console.log('success');}
    );
    this.returnFermeList();
  }

  deleteFerme(){
    var r = confirm("Voulez-vous vraiment supprimer une ferme");
    if (r) {
      this.service.deleteFerme(this.currentId).subscribe(
        res => {console.log('success');}
      );
      this.returnFermeList();
    }




  }

  shapefileZipChange(event){
    this.listFile = event.srcElement.files;
    this.service.getGeojson(this.listFile).subscribe(geojson => {
      this.ferme.geojson = geojson;
    });
  }



}
