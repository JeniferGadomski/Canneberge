import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {usersRoutes} from "./users/users.routes";
import {fermesRoutes} from "./fermes/fermes.routes";
import {ScriptComponent} from "./script/script.component";


const routes: Routes = [
  { path: '', redirectTo: '/utilisateurs', pathMatch: 'full' },
  ...usersRoutes,
  ...fermesRoutes,
  {path: 'script', component : ScriptComponent},
  { path : "**", redirectTo: '/utilisateurs'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
