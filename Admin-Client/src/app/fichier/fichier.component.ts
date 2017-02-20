import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";
import {rename} from "fs";

@Component({
  selector: 'app-fichier',
  templateUrl: './fichier.component.html',
  styleUrls: ['./fichier.component.css']
})
export class FichierComponent implements OnInit {

  currentPathList = [];
  currentPathString  = '/';
  listFiles = [];

  constructor(
    private service : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router,
  )
  { }

  ngOnInit() {
    this.getListInFolder('/');
  }

  clickFolder(folderPath){
    if(folderPath.substr(-1) === '/'){
      this.getListInFolder(folderPath);
    }
    else{
      window.open('http://localhost:8080/api/file' + folderPath);
    }
  }

  clickNewFolder(){
    let i = prompt("Nom du nouveau dossier.");
    if(i){
      this.service.postNewFolder(this.currentPathString + i + '/').subscribe(
        rep => {
          this.getListInFolder(this.currentPathString);
        }
      )
    }
  }

  clickRemoveWithPath(path){
    let i = confirm("Voulez-vous vraiment supprimer : " + path +'  ?');
    if(i){
      this.service.deleteWithPath(path).subscribe(
        rep => {
          console.log(path);
          console.log(this.currentPathString);
          this.getListInFolder(this.currentPathString);
        }
      )
    }
  }

  getListInFolder(folderPath){
    this.currentPathString = folderPath;
    this.pathToList();
    this.service.getFile(folderPath).subscribe(
      files => {
        this.updateListFile(files)
      }
    )
  }

  pathToList(){
    let tmpString = this.currentPathString.substring(1);
    this.currentPathList = [];
    let splitList = tmpString.split('/');
    for(let i = 0; i < splitList.length; i++)  {
      let p = splitList[i];
      this.currentPathList.push({
        name : splitList[i],
        path : this.currentPathString.substring(this.currentPathString.indexOf(p), -1).toString() + p + '/'
      });
    }
  }

  updateListFile(reqFileList){
    this.listFiles = [];
    for(let i = 0; i < reqFileList.length; i++){
      let p = reqFileList[i];
      this.listFiles.push({
        name : p.replace(this.currentPathString, ''),
        path : p
      });
    }
  }

  addFile(newFileInput){
    newFileInput.click();
  }

  fileSelected(event){
    console.log(event.srcElement.files);
    if(event.srcElement.files.lenght === 0){
      return;
    }
    let file = event.srcElement.files[0];
    this.service.postNewFile(this.currentPathString + file.name , [file]).subscribe(
      req => {
        this.getListInFolder(this.currentPathString);
      }
    )
  }

  popUpRename(fileName){
    if(fileName.substr(-1) === '/')
      fileName = fileName.substring(0, fileName.length - 1);
    let n = prompt('Renommer', fileName);
    if(n){
      this.service.renameFile(this.currentPathString + fileName, this.currentPathString + n).subscribe(
        req => {
          this.getListInFolder(this.currentPathString);
        }
      )
    }
  }

  getInfopath(path){
    this.service.getInfoPath(path).subscribe(
      req => {
        alert('Taille : ' + this.fileSizeSI(req.size));
      }
    )
  }

  fileSizeSI(size) {
    let e = (Math.log(size) / Math.log(1e3)) | 0;
    return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
}



}
