import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EventsComponent } from './pages/evenements/evenements';
import { GestionEvenementsComponent } from './backoffice/amicale/gestion-evenements/gestion-evenements';

export const routes: Routes = [

  // PAGE LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },

  // REDIRECTION PAR DEFAUT
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // APPLICATION
  {
    path: '',
    component: LayoutComponent,
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'evenements',
        component: EventsComponent
      },

      {
        path: 'gestion-evenements',
        component: GestionEvenementsComponent
      },

      {
        path: 'mes-evenements',
        component: EventsComponent
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(m => m.ProfileComponent)
      }

    ]
  }

];