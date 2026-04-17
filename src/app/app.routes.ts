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

      // 📅 EVENEMENTS
      {
        path: 'evenements',
        component: EventsComponent,
        runGuardsAndResolvers: 'always'
      },

      // 🔥 NOUVELLE PAGE INSCRIPTION
      {
        path: 'inscription/:id',
        loadComponent: () =>
          import('./pages/inscription/inscription')
            .then(m => m.InscriptionComponent)
      },
      
  {
  path: 'evenement/:id',
  loadComponent: () =>
    import('./pages/evenement-details/evenement-details')
      .then(m => m.EvenementDetailsComponent)
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

      // 🗳️ SONDAGES
      {
        path: 'gestion-sondages',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-sondages/list-sondages/list-sondages')
            .then(m => m.ListSondagesComponent)
      },
      {
        path: 'gestion-sondages/create',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-sondages/create-sondage/create-sondage')
            .then(m => m.CreateSondageComponent)
      },
      {
        path: 'gestion-sondages/edit/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-sondages/edit-sondage/edit-sondage')
            .then(m => m.EditSondageComponent)
      },
      {
        path: 'gestion-sondages/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-sondages/sondage-detail/sondage-detail')
            .then(m => m.SondageDetailComponent)
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
          import('./backoffice/amicale/admin/admin-users/admin-users')
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
      },
      {
        path: 'admin-user-profile/:matricule',
        loadComponent: () =>
          import('./backoffice/amicale/admin/admin-user-profile/admin-user-profile')
            .then(m => m.AdminUserProfile)
      },
    ]
  },

  // 🔥 FALLBACK (important)
  {
    path: '**',
    redirectTo: 'login'
  }

];