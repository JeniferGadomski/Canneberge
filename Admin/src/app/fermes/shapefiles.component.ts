import { Component, OnInit } from '@angular/core';
import {CannebergeApiService} from "../canneberge-api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-shapefiles',
  templateUrl: './shapefiles.component.html',
  styleUrls: ['./fermes.component.css']
})
export class ShapefilesComponent implements OnInit {

  ferme: any;
  private currentId;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: CannebergeApiService) {
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

  getZipSrc(raster){
    let url = 'http://api.canneberge.io' + raster.path.zip;
    url += '?apiKey=' + this.service.apiKey;
    return url;
  }

  addFile(newFileInput){
    newFileInput.click();
  }

  postNewShapefile(event){
    console.log(event.srcElement.files);
    if(event.srcElement.files.lenght === 0){
      return;
    }
    let file = event.srcElement.files[0];
    event.srcElement.value = '';
    console.log(event.srcElement);
    this.service.postNewShapefile(this.ferme._id, [file]).subscribe(
      req => {
        this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
      }
    )
  }

  deleteShapefile(shapefile){
    let i = confirm("Voulez-vous vraiment supprimer le shapefile : " + shapefile.name +'  ?');
    if(i){
      this.service.deleteShapefile(this.ferme._id, shapefile._id).subscribe(
        rep => {
          this.service.getFerme(this.currentId).subscribe(ferme => this.ferme = ferme);
        }
      )
    }
  }

}
