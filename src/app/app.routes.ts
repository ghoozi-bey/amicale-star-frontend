import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EventService } from './pages/evenements/evenements';
import { GestionEvenementsComponent } from './backoffice/amicale/gestion-evenements/gestion-evenements';

export const routes: Routes = [

{
  path: '',
  component: LayoutComponent,
  children: [

    { path: '', component: DashboardComponent },

    // page événements pour tous les adhérents
    { path: 'evenements', component: EventService },

    // backoffice membre amicale
    { path: 'gestion-evenements', component: GestionEvenementsComponent }

  ]
}

];