import { Routes } from '@angular/router';
import {FermesComponent} from "./fermes.component";
import {FermesAddComponent} from "./fermes-add.component";
import {FermesDetailComponent} from "./fermes-detail.component";




// Route Configuration
export const fermesRoutes: Routes = [
  { path: 'fermes/nouveau', component : FermesAddComponent},
  { path: 'fermes', component: FermesComponent, children : [
    {path : ':id', component : FermesDetailComponent}
  ]
  }

];
