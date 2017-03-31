import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CannebergeApiService} from "../canneberge-api.service";
import {DatePickerOptions, DateModel} from "ng2-datepicker";
import {fermesRoutes} from "./fermes.routes";
declare var swal: any;

@Component({
  templateUrl: 'fermes-detail.component.html',
  styleUrls: ['../fermes/fermes.component.css']
})
export class FermesDetailComponent implements OnInit {

  ferme: any;
  listFile: File[];
  private currentId;
  date: DateModel;
  options: DatePickerOptions;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: CannebergeApiService) {
    this.options = new DatePickerOptions();
    console.log(this.date);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
      // Retrieve Pet with Id route param
      this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
      console.log(this.ferme);
    });
  }

  returnFermeList() {
    this.router.navigate(['/fermes']);
    // window.location.href = 'fermes';
  }

  saveFerme() {
    this.service.saveFerme(this.currentId, this.ferme).subscribe(
      res => {
        console.log('success');
      }
    );
    this.returnFermeList();
  }

  deleteFerme() {
    var r = confirm("Voulez-vous vraiment supprimer une ferme");
    if (r) {
      this.service.deleteFerme(this.currentId).subscribe(
        res => {
          console.log('success');
        }
      );
      this.returnFermeList();
    }


  }

  shapefileZipChange(event) {
    this.listFile = event.srcElement.files;
    let espg = prompt('ESPG Source (espg: )', '26918');
    if (espg) {
      let tmpEspg = parseInt(espg);
      this.service.getGeojson(this.listFile, tmpEspg).subscribe(geojson => {
        this.ferme.geojson = geojson;
      });
    }
  }

  getPngSrc(raster){
    let url = 'http://api.canneberge.io' + raster.path.png;
    url += '?apiKey=' + this.service.apiKey;
    return url;
  }

  getTifSrc(raster){
    let url = 'http://api.canneberge.io' + raster.path.tif;
    url += '?apiKey=' + this.service.apiKey;
    return url;
  }

  addFile(newFileInput){
    newFileInput.click();
  }

  postNewRaster(event){
    console.log(event.srcElement.files);
    if(event.srcElement.files.lenght === 0){
      return;
    }
    let file = event.srcElement.files[0];
    event.srcElement.value = '';
    console.log(event.srcElement);
    let dateSelected = new Date(parseInt(this.date.year), parseInt(this.date.month) - 1, parseInt(this.date.day));
    this.service.postNewRaster(dateSelected.getTime(), this.ferme._id, [file]).subscribe(
      req => {
        this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
      }
    )
  }

  deleteRaster(raster){
    let i = confirm("Voulez-vous vraiment supprimer le raster : " + raster.name +'  ?');
    if(i){
      this.service.deleteRaster(this.ferme._id, raster._id).subscribe(
        rep => {
          this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
        }
      )
    }
  }





}
