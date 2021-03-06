import {Component, OnInit, ViewChild} from '@angular/core';
import { AceEditorDirective } from 'ng2-ace-editor';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector : 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent {

  @ViewChild('editor') editor;
  text: string = "#Hello world";
  output : string = "";

  indexSelectedScript = 0;
  inputCommandValue : string = "> ";
  lastCommand = '';
  baseUrl = "http://r.canneberge.io/filetext";
  urlIFrame : any;
  showIFrame = false;
  showInfo = false;

  scripsData = [
    // {
    // name : 'HelloWorld.R',
    // code : 'print(\'Hello world\')\n' +
    //   'out <- capture.output(print(\'bonjour\'))\n' +
    //   'out <- c(out, capture.output(rep(\'c\', 10)))\n' +
    //   'print(out)\n'
    // },
    // {
    // name : 'HelloWorld2.R',
    // code : 'print(\'Hello world2\')'
    // }
  ];

  code = '';

  constructor(
    private service : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer : DomSanitizer
  )
  { }


  ngAfterViewInit() {

    this.service.getUser(this.service.apiKey).subscribe(
      user => {
        this.scripsData = user.scripts;
        this.selectScript(0);
      }
    );


    this.editor.getEditor().setOptions({
      highlightSelectedWord : true

  });
    this.editor.getEditor().$blockScrolling = Infinity; //Disable warning
  }

  selectScript(index){
    this.indexSelectedScript = index;
    if(this.scripsData.length === 0)
      this.code = '';
    else
      this.code = this.scripsData[this.indexSelectedScript].code
  }

  newScript(){
    let name = ".R";
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear() + '-' + today.getHours()
      + ':' + today.getMinutes() + ':' + today.getSeconds();
    let code = "# Créé le : " + date + '\n\n';
    this.scripsData.push({name : name, code : code});

    this.selectScript(this.scripsData.length - 1);

  }

  executeFile(){
    this.updateCode();
    this.lastCommand = '> ' + this.scripsData[this.indexSelectedScript].name;
    console.log(this.editor.text);
    this.service.sendRFiletext(this.editor.text).subscribe(
      output => {
        console.log(output);
        this.output = output;
        this.getIframeUrl(this.baseUrl);
        this.showIFrame = true;
        this.showInfo = false;
      }
    )
  }

  saveScripts(){
    this.updateCode();
    this.service.saveUser(this.service.apiKey, {scripts : this.scripsData}).subscribe(
      rep => console.log(rep)
    );
  }

  updateCode(){
    if(this.scripsData.length > 0){
        this.scripsData[this.indexSelectedScript].code = this.code;
    }
  }

  isSelected(script){
    return script ===  this.scripsData[this.indexSelectedScript];
  }


  removeScript(i){
    let r = confirm("Voulez-vous vraiment supprimer le scripts : " + this.scripsData[i].name + "?");
    if (r) {
      this.scripsData.splice(i, 1);
      if(i < this.indexSelectedScript){
        this.indexSelectedScript = this.indexSelectedScript - 1;
      }
      else if(i == this.indexSelectedScript){
        this.indexSelectedScript = 0
      }
      this.selectScript(this.indexSelectedScript);
      console.log(this.scripsData);
      this.saveScripts();
    }
  }

  getIframeUrl(url){
    this.urlIFrame = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleInfo(){
    this.showIFrame = false;
    this.showInfo = !this.showInfo;
  }



}
