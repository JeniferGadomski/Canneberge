import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {usersRoutes} from "./users/users.routes";
import {fermesRoutes} from "./fermes/fermes.routes";


const routes: Routes = [
  { path: '', redirectTo: '/utilisateurs', pathMatch: 'full' },
  ...usersRoutes,
  ...fermesRoutes,
  { path : "**", redirectTo: '/utilisateurs'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
