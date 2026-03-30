import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EventsComponent } from './pages/evenements/evenements';
import { GestionEvenementsComponent } from './backoffice/amicale/gestion-evenements/gestion-evenements';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: DashboardComponent },
      { path: 'evenements', component: EventsComponent },
      { path: 'gestion-evenements', component: GestionEvenementsComponent },
      { path: 'mes-evenements', component: EventsComponent },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(m => m.ProfileComponent)
      },

      // ✅ ADMIN
      {
        path: 'admin-users',
        loadComponent: () =>
          import('./backoffice/amicale/admin/users/admin-users')
            .then(m => m.AdminUsersComponent)
      },
      {
        path: 'admin-create-user',
        loadComponent: () =>
          import('./backoffice/amicale/admin/users/admin-users')
            .then(m => m.AdminUsersComponent)
      }

    ]
  }

];