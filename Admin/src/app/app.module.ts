import { BrowserModule } from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app.routes";
import {UsersComponent} from "./users/users.component";
import {UsersDetailComponent} from "./users/users-detail.component";
import {CannebergeApiService} from "./canneberge-api.service";
import {SortPipe} from "./sortBy.pipe";
import {UsersAddComponent} from "./users/users-add.component";
import { FermesComponent } from './fermes/fermes.component';
import { FermesAddComponent } from './fermes/fermes-add.component';
import {FermesDetailComponent} from "./fermes/fermes-detail.component";
import { ScriptComponent } from './script/script.component';
import {AceEditorDirective, AceEditorComponent} from 'ng2-ace-editor';
import { FichierComponent } from './fichier/fichier.component';
import {DatePickerModule} from "ng2-datepicker";
import { FermesRastersComponent } from './fermes/fermes-rasters.component';

export function startupServiceFactory(startupService: CannebergeApiService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [
    AceEditorComponent,
    AceEditorDirective,
    AppComponent,
    UsersComponent,
    UsersDetailComponent,
    UsersAddComponent,
    SortPipe,
    FermesComponent,
    FermesAddComponent,
    FermesDetailComponent,
    ScriptComponent,
    FichierComponent,
    FermesRastersComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DatePickerModule
  ],
  providers: [
    CannebergeApiService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [CannebergeApiService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
