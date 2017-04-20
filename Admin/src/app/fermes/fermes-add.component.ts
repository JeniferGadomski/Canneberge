import {Component, OnInit, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";
declare var swal: any;
declare var fileUtilites : any;

@Component({
  selector: 'app-fermes-add',
  templateUrl: 'fermes-add.component.html',
  styleUrls: ['./fermes.component.css', '../users/users.component.css']
})
export class FermesAddComponent implements OnInit {

  ferme : any;
  listFile : File[];

  constructor(
    private cannebergeApiService : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router,
    private elRef : ElementRef
  ) { }

  ngOnInit() {
    this.ferme = {
      name : ''
    }

  }

  returnFermesList(){
    this.router.navigate(['/fermes']);
  }

  saveNewFerme(){
    this.cannebergeApiService.saveNewFerme(this.ferme).subscribe(
      res => {
        console.log(res);
        this.returnFermesList();
      }
      );
  }

  popAlert(saveMessage){
    console.log(saveMessage);
    if(saveMessage.success) {
      swal({
        title: "Sauvegarder!",
        type: "success"
      });
      this.returnFermesList();
    }
    else{
      swal({
        title : "Problème",
        text: saveMessage.message,
        type :"error"
      });
    }
  }

  // shapefileZipChange(event){
  //   this.listFile = event.srcElement.files;
  //   let espg = prompt('ESPG Source (espg: )', '26918');
  //   if(espg){
  //     let tmpEspg = parseInt(espg);
  //     this.cannebergeApiService.getGeojson(this.listFile, tmpEspg).subscribe(geojson => {
  //       this.ferme.geojson = geojson;
  //     });
  //   }
  // }



}
