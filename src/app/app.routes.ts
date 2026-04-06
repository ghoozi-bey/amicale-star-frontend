import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EventsComponent } from './pages/evenements/evenements';
import { GestionEvenementsComponent } from './backoffice/amicale/membre-amicale/gestion-evenements/gestion-evenements';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [

  // 🔐 LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent)
  },

  // 🔁 REDIRECTION
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🔐 ZONE PROTÉGÉE
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      // 📊 DASHBOARD
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      // 📅 EVENEMENTS (🔥 FIX ICI)
      {
        path: 'evenements',
        component: EventsComponent,
        runGuardsAndResolvers: 'always' // 🔥 important
      },

      // ➕ GESTION EVENEMENTS
      {
        path: 'gestion-evenements',
        component: GestionEvenementsComponent
      },

      // 👤 MES EVENEMENTS (adhérent)
      {
        path: 'mes-evenements',
        loadComponent: () =>
          import('./backoffice/amicale/adherent/mes-evenements/mes-evenements')
            .then(m => m.MesEvenementsComponent)
      },

      // 🟢 MES EVENEMENTS (amicale)
      {
        path: 'mes-evenements-amicale',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/mes-evenements-membre-amicale/mes-evenements-membre-amicale')
            .then(m => m.MesEvenementsMembreAmicaleComponent)
      },

      // ✏️ MODIFIER EVENEMENT
      {
        path: 'modifier-evenement/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/modifier-evenement/modifier-evenement')
            .then(m => m.ModifierEvenementComponent)
      },

      // 👤 PROFILE
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(m => m.ProfileComponent)
      },

      // 🔴 ADMIN
      {
        path: 'admin-users',
        loadComponent: () =>
          import('./backoffice/amicale/admin/users/admin-users')
            .then(m => m.AdminUsersComponent)
      },
      {
        path: 'admin-create-user',
        loadComponent: () =>
          import('./backoffice/amicale/admin/admin-create-user/admin-create-user')
            .then(m => m.AdminCreateUserComponent)
      },
      {
        path: 'admin-edit-user/:matricule',
        loadComponent: () =>
          import('./backoffice/amicale/admin/admin-edit-user/admin-edit-user')
            .then(m => m.AdminEditUserComponent)
      }

    ]
  }

];