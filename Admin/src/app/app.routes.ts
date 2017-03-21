import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {usersRoutes} from "./users/users.routes";
import {fermesRoutes} from "./fermes/fermes.routes";
import {ScriptComponent} from "./script/script.component";
import {FichierComponent} from "./fichier/fichier.component";


const routes: Routes = [
  {path: 'scripts', component : ScriptComponent},
  {path : 'fichiers', component : FichierComponent},
  {path : 'fichiers/:fermeId', component : FichierComponent},
    ...usersRoutes,
    ...fermesRoutes,
  { path: '', redirectTo: '/utilisateurs', pathMatch : 'full'},
  { path : "**", redirectTo: '/utilisateurs'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
