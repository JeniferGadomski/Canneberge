import {Component, OnInit, Renderer} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";

@Component({
  selector: 'app-fichier',
  templateUrl: './fichier.component.html',
  styleUrls: ['./fichier.component.css']
})
export class FichierComponent implements OnInit {

  currentPathList = [];
  currentPathString  = '/';
  listFiles = [];

  pathElementOver = '';
  currentPathOver = '';
  currentDragendFile = '';

  constructor(
    private service : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router,
    private render : Renderer
  )
  {  }

  ngOnInit() {
    this.getListInFolder('/');
  }

  clickFolder(folderPath){
    if(folderPath.substr(-1) === '/'){
      this.getListInFolder(folderPath);
    }
    else{
      window.open(this.service.serverUrl + '/file' + folderPath);
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

  isAFolder(path){
    return path.substr(-1) === '/';
  }

  isHover(path){
    return path === this.pathElementOver;
  }

  onMouseEnter(path){
    this.pathElementOver = path;
  }


  dragStart_handler(event, path){
    this.currentDragendFile = path;
    this.render.setElementClass(event.target , 'dragen', true);
  }

  dragEnd_handler(event){
    this.render.setElementClass(event.target , 'dragen', false);
  }

  dragEnter_handler(event, path){
    this.currentPathOver = path;
    if(event.target.classList.value != "" && this.isAFolder(path)){
      this.render.setElementClass(event.target, 'drag-over', true);
    }

  }

  onDragLeave(event, path){
      if(path !== this.currentPathOver){
        this.render.setElementClass(event.target, 'drag-over', false);
      }
  }

  onDrop(event, path){
    this.render.setElementClass(event.target, 'drag-over', false);
    if(this.isAFolder(path)){
      this.service.postMoveFile(this.currentPathString + this.currentDragendFile, path + this.currentDragendFile)
        .subscribe(
          req => {
            this.getListInFolder(this.currentPathString);
          }
        )
    }
  }
}
