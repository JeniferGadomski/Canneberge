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
  baseUrl = "http://localhost:8888/filetext";
  urlIFrame : any;
  showIFrame = false;

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

    this.service.getUser('5894a2f1df1f28501873a566').subscribe(
      user => {
        this.scripsData = user.scripts;
      }
    );


    this.editor.getEditor().setOptions({
      highlightSelectedWord : true

  });
    this.editor.getEditor().$blockScrolling = Infinity; //Disable warning
  }

  selectScript(index){
    this.indexSelectedScript = index;
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

  sendCommandLine(){
    let command = this.inputCommandValue.substring(2);
    console.log(command);
    this.service.sendRCommandLine(command).subscribe(
      output => {
        this.output = output;
        this.lastCommand = this.inputCommandValue;
        this.inputCommandValue = '> ';
      }
    );
  }

  promtInput(){
    if(this.inputCommandValue.indexOf('> ') !== 0){
      this.inputCommandValue = '> ';
    }
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
      }
    )
  }

  saveScripts(){
    this.updateCode();
    this.service.saveUser('5894a2f1df1f28501873a566', {scripts : this.scripsData}).subscribe(
      rep => console.log(rep)
    );
  }

  updateCode(){
    if(this.scripsData.length > 0){
        this.scripsData[this.indexSelectedScript].code = this.editor.text;
    }
  }

  isSelected(script){
    return script ===  this.scripsData[this.indexSelectedScript];
  }


  removeScript(i){
    if(this.indexSelectedScript === this.scripsData.length - 1){
      this.indexSelectedScript = this.scripsData.length - 2
    }
    this.scripsData.splice(i, 1);
    if(i === this.indexSelectedScript && this.scripsData.length !== 0)
      this.selectScript(0);

    this.saveScripts()

  }

  getIframeUrl(url){
    this.urlIFrame = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }



}
