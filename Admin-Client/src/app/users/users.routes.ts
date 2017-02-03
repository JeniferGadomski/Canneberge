// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';
import {UsersComponent} from "./users.component";
import {UsersDetailComponent} from "./users-detail.component";
import {UsersAddComponent} from "./users-add.component";



// Route Configuration
export const usersRoutes: Routes = [
  { path: 'utilisateurs/nouveau', component: UsersAddComponent},
  { path: 'utilisateurs', component: UsersComponent, children: [
    { path: ':id', component: UsersDetailComponent }
  ]}
];
