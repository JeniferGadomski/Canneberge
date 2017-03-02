import {Injectable, ElementRef} from '@angular/core';
import {Http, Headers, RequestOptions, Response, ResponseContentType, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import * as FileSaver from "file-saver";

declare var CrossDomainStorage: any;

@Injectable()
export class CannebergeApiService {

  serverUrl = "http://api.canneberge.io/api";
  headers = new Headers();
  apiKey = '5894a2f1df1f28501873a566';

  constructor(
    private _http : Http
  ) {
    this.headers.append('x-access-token', this.apiKey);

    // Getting apiKey from portail.canneberge.io
    let remoteStorage = new CrossDomainStorage("http://portail.canneberge.io", "/retrieve");
    remoteStorage.requestValue("apiKey", function(key, value){
      console.log('Key : ' + key + '   value : ' + value);
      if(value === null){
        // $window.location = 'http://portail.canneberge.io';
      }
      else{
        console.log(this.headers);
        this.headers.append('x-access-token', value);
        // apiService.headers.headers['x-access-token'] = value;
        // initFerme();
      }
    });

    remoteStorage.requestValue('apiKey')

  }




  getUsers(){
      return this._http.get(this.serverUrl + '/users', {headers : this.headers})
        .map(res => res.json());
  }

  getUser(id : number | string) {
    return this._http.get(this.serverUrl + '/users/'+ id, {headers : this.headers})
      .map(res => {
        return res.json().user;
      });
  }

  saveUser(id : string, userValue : any)
  {
    return this._http.put(this.serverUrl + '/users/' + id, userValue, {headers : this.headers});
  }

  saveNewUser(userValue : any)
  {
    console.log(userValue);
    return this._http.post(this.serverUrl + '/users', userValue, {headers : this.headers})
      .map(res => res.json());
  }

  deleteUser(id : string)
  {
    return this._http.delete(this.serverUrl + '/users/' + id, {headers : this.headers});
  }

  // Service ferme

  getFermes()
  {
    return this._http.get(this.serverUrl + '/fermes', {headers : this.headers})
      .map(res => res.json());
  }

  saveNewFerme(ferme : any) {
    console.log(ferme);
    return this._http.post(this.serverUrl + '/fermes', ferme, {headers : this.headers})
      .map(res => res.json());
  }

  getGeojson (files: File[]) {
    let url = this.serverUrl + '/shapefile-to-geojson';
    let formData:FormData = new FormData();
    formData.append('shapefileZip', files[0], files[0].name);
       return this._http.post(url, formData, {
        headers: this.headers
      }).map(res => res.json());
  }

  getShapefile(geojson : any){
    let url = this.serverUrl + '/geojson-to-shapefile';
    console.log('api getshapefile');
    console.log(geojson);
    this.headers.append('responseType', 'arraybuffer');
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
    return this._http.get(this.serverUrl + '/fermes/'+ id, {headers : this.headers})
      .map(res => {
        return res.json().ferme;
      });
  }

  saveFerme(id : number | string, ferme : any){
    return this._http.put(this.serverUrl + '/fermes/' + id, ferme, {headers : this.headers});
  }

  deleteFerme(id : string){
    return this._http.delete(this.serverUrl + '/fermes/' + id, {headers : this.headers});
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
    let formData:FormData = new FormData();
    formData.append('filetext', filetext);
    return this._http.post(this.serverUrl + '/executeR', formData, {
      headers: this.headers
    }).map(res => res.json());
  }


  getFile(path){
    return this._http.get(this.serverUrl + '/file' + path, {headers : this.headers})
      .map(res => res.json());
  }

  postNewFolder(path){
    return this._http.post(this.serverUrl + '/file' + path, {}, {headers : this.headers})
      .map(res => res);
  }

  deleteWithPath(path){
    return this._http.delete(this.serverUrl + '/file' + path, {headers : this.headers})
      .map(res => res);
  }

  postNewFile(path, file){
    let inputFile = new Blob(file);
    return this._http.post(this.serverUrl + '/file' + path, inputFile, {headers : this.headers})
      .map(res => res);
  }

  renameFile(path, newPath){
    return this._http.post(this.serverUrl + '/file' + path, {newPath : newPath}, {headers : this.headers})
      .map(res => res);
  }

  getInfoPath(path){
    return this._http.get(this.serverUrl + '/file' + path + '?stat=true')
      .map(res => res.json());
  }

  postMoveFile(originalPath, moveToPath){
    return this._http.post(this.serverUrl + '/file' + originalPath, {newPath : moveToPath}, {headers : this.headers})
      .map(res => res);
  }




}
