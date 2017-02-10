import {Component, OnInit, ViewChild} from '@angular/core';
import { AceEditorDirective } from 'ng2-ace-editor';

@Component({
  selector : 'app-script',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent {

  @ViewChild('editor') editor;
  text: string = "#Hello world";

  scripsData = [
    {
    name : 'HelloWorld.R',
    code : 'print(\'Hello world\')'
    },
    {
    name : 'HelloWorld2.R',
    code : 'print(\'Hello world2\')'
    }
  ];


  ngAfterViewInit() {

    this.editor.getEditor().setOptions({
      highlightSelectedWord : true

  });
    this.editor.getEditor().$blockScrolling = Infinity;
  }

}
