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

  // shapefileZipChange(event) {
  //   this.listFile = event.srcElement.files;
  //   let espg = prompt('ESPG Source (espg: )', '26918');
  //   if (espg) {
  //     let tmpEspg = parseInt(espg);
  //     this.service.getGeojson(this.listFile, tmpEspg).subscribe(geojson => {
  //       this.ferme.geojson = geojson;
  //     });
  //   }
  // }







}
