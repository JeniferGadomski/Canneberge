import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UsersDetailComponent,
    UsersAddComponent,
    SortPipe,
    FermesComponent,
    FermesAddComponent,
    FermesDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    CannebergeApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
