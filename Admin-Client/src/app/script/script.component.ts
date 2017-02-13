import {Component, OnInit, ViewChild} from '@angular/core';
import { AceEditorDirective } from 'ng2-ace-editor';
import {Router, ActivatedRoute} from "@angular/router";
import {CannebergeApiService} from "../canneberge-api.service";

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

  scripsData = [
    {
    name : 'HelloWorld.R',
    code : 'print(\'Hello world\')\n' +
      'out <- capture.output(print(\'bonjour\'))\n' +
      'out <- c(out, capture.output(rep(\'c\', 10)))\n' +
      'print(out)\n'
    },
    {
    name : 'HelloWorld2.R',
    code : 'print(\'Hello world2\')'
    }
  ];

  constructor(
    private service : CannebergeApiService,
    private route: ActivatedRoute,
    private router: Router
  )
  { }


  ngAfterViewInit() {

    this.editor.getEditor().setOptions({
      highlightSelectedWord : true

  });
    this.editor.getEditor().$blockScrolling = Infinity; //Disable warning
  }

  selectScript(index){
    this.indexSelectedScript = index;

  }

  newScript(){
    let name = "Nouveau_script.R";
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear() + '-' + today.getHours()
      + ':' + today.getMinutes() + ':' + today.getSeconds();
    let code = "# Créé le : " + date + '\n\n';
    this.scripsData.push({name : name, code : code});

    this.indexSelectedScript = this.scripsData.length - 1;
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
    this.scripsData[this.indexSelectedScript].code = this.editor.text;
    this.lastCommand = '> ' + this.scripsData[this.indexSelectedScript].name;
    console.log(this.editor.text);
    this.service.sendRFiletext(this.editor.text).subscribe(
      output => {
        console.log(output);
        this.output = output;
      }
    )
  }



}
