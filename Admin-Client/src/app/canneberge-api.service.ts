import {Injectable, ElementRef} from '@angular/core';
import {Http, Headers, RequestOptions, Response, ResponseContentType, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import * as FileSaver from "file-saver";

@Injectable()
export class CannebergeApiService {

  constructor(private _http : Http) { }

  private serverUrl = "http://localhost:8080/api";

  getUsers(){
      return this._http.get(this.serverUrl + '/users')
        .map(res => res.json());
  }

  getUser(id : number | string) {
    return this._http.get(this.serverUrl + '/users/'+ id)
      .map(res => {
        return res.json().user;
      });
  }

  saveUser(id : string, userValue : any)
  {
    return this._http.put(this.serverUrl + '/users/' + id, userValue);
  }

  saveNewUser(userValue : any)
  {
    console.log(userValue);
    return this._http.post(this.serverUrl + '/users', userValue)
      .map(res => res.json());
  }

  deleteUser(id : string)
  {
    return this._http.delete(this.serverUrl + '/users/' + id);
  }

  // Service ferme

  getFermes()
  {
    return this._http.get(this.serverUrl + '/fermes')
      .map(res => res.json());
  }

  saveNewFerme(ferme : any) {
    console.log(ferme);
    return this._http.post(this.serverUrl + '/fermes', ferme)
      .map(res => res.json());
  }

  getGeojson (files: File[]) {
    let url = this.serverUrl + '/shapefile-to-geojson';
    let headers = new Headers();
    let formData:FormData = new FormData();
    formData.append('shapefileZip', files[0], files[0].name);
       return this._http.post(url, formData, {
        headers: headers
      }).map(res => res.json());
  }

  getShapefile(geojson : any){
    let url = this.serverUrl + '/geojson-to-shapefile';
    console.log('api getshapefile');
    console.log(geojson);
    let headers = new Headers();
    headers.append('responseType', 'arraybuffer');
    return this._http.post(url, {geojson : JSON.stringify(geojson)}, {
      method: RequestMethod.Post,
      responseType: ResponseContentType.Blob,
      headers: new Headers({'Content-type': 'application/json'})
    })
      .subscribe(
        (response) => {
          var blob = new Blob([response.blob()], {type: 'application/zip'});
          var filename = 'shapefile.zip';
          FileSaver.saveAs(blob, filename);
        }
      );
  }

  getFerme(id : number | string) {
    return this._http.get(this.serverUrl + '/fermes/'+ id)
      .map(res => {
        return res.json().ferme;
      });
  }

  saveFerme(id : number | string, ferme : any){
    return this._http.put(this.serverUrl + '/fermes/' + id, ferme);
  }

  deleteFerme(id : string){
    return this._http.delete(this.serverUrl + '/fermes/' + id);
  }

  sendRCommandLine(commandLine : string){
    let headers = new Headers();
    let formData:FormData = new FormData();
    formData.append('command', commandLine);
    return this._http.post(this.serverUrl + '/executeR', formData, {
      headers: headers
    }).map(res => res.json());
  }

  sendRFiletext(filetext : string){
    let headers = new Headers();
    let formData:FormData = new FormData();
    formData.append('filetext', filetext);
    return this._http.post(this.serverUrl + '/executeR', formData, {
      headers: headers
    }).map(res => res.json());
  }


  getFile(path){
    return this._http.get(this.serverUrl + '/file' + path)
      .map(res => res.json());
  }

  postNewFolder(path){
    return this._http.post(this.serverUrl + '/file' + path, {})
      .map(res => res);
  }

  deleteWithPath(path){
    return this._http.delete(this.serverUrl + '/file' + path, {})
      .map(res => res);
  }

  postNewFile(path, file){
    let inputFile = new Blob(file);
    return this._http.post(this.serverUrl + '/file' +path, inputFile)
      .map(res => res);
  }

  renameFile(path, newPath){
    return this._http.post(this.serverUrl + '/file' + path, {newPath : newPath})
      .map(res => res);
  }

  getInfoPath(path){
    return this._http.get(this.serverUrl + '/file' + path + '?stat=true')
      .map(res => res.json());
  }




}
