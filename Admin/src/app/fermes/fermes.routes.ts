import { Routes } from '@angular/router';
import {FermesComponent} from "./fermes.component";
import {FermesAddComponent} from "./fermes-add.component";
import {FermesDetailComponent} from "./fermes-detail.component";
import {FermesRastersComponent} from "./fermes-rasters.component";




// Route Configuration
export const fermesRoutes: Routes = [
  { path: 'fermes/nouveau', component : FermesAddComponent},
  { path: 'fermes', component: FermesComponent},
  {path : 'fermes/:id/rasters', component : FermesRastersComponent},
  {path : 'fermes/:id', component : FermesDetailComponent}

];
