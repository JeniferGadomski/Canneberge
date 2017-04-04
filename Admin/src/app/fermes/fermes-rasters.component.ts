import { Component, OnInit } from '@angular/core';
import {DatePickerOptions, DateModel} from "ng2-datepicker";
import {CannebergeApiService} from "../canneberge-api.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-fermes-rasters',
  templateUrl: 'fermes-rasters.component.html',
  styleUrls: ['./fermes.component.css']
})
export class FermesRastersComponent implements OnInit {

  ferme: any;
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

  getUrlSeeRasterOnCarte(raster){
    let url = 'http://carte.canneberge.io/';
    url += '?fermeId=' + this.ferme._id;
    url += '&rasterId=' + raster._id;
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
