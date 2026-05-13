import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { GestionEvenementsComponent } from './backoffice/amicale/membre-amicale/gestion-evenements/gestion-evenements';


import { authGuard } from './services/auth.guard';
import { CreateElection } from './backoffice/amicale/Responsable-election/create-election/create-election';
import { ListElections } from './backoffice/amicale/Responsable-election/list-elections/list-elections';
import { ElectionDetail } from './backoffice/amicale/Responsable-election/election-detail/election-detail';
import { EditElection } from './backoffice/amicale/Responsable-election/edit-election/edit-election';
import { Elections } from './pages/elections/elections';
import { ElectionDetailPublic } from './pages/election-detail-public/election-detail-public';
import { ElectionStats } from './backoffice/amicale/Responsable-election/election-stats/election-stats';

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

    // 🔥 important pour refresh
    runGuardsAndResolvers: 'always',

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'evenements',
        redirectTo: 'mes-evenements',
        pathMatch: 'full'
      },

      {
        path: 'mes-evenements',
        loadComponent: () =>
          import('./backoffice/amicale/adherent/mes-evenements/mes-evenements')
            .then(m => m.MesEvenementsComponent)
      },

      {
        path: 'evenement/:id',
        loadComponent: () =>
          import('./pages/evenement-details/evenement-details')
            .then(m => m.EvenementDetailsComponent)
      },

      {
        path: 'inscription/:id',
        loadComponent: () =>
          import('./pages/inscription/inscription')
            .then(m => m.InscriptionComponent)
      },

      {
        path: 'gestion-evenements',
        component: GestionEvenementsComponent
      },

      {
        path: 'mes-evenements-amicale',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/mes-evenements-membre-amicale/mes-evenements-membre-amicale')
            .then(m => m.MesEvenementsMembreAmicaleComponent)
      },

      {
        path: 'modifier-evenement/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/modifier-evenement/modifier-evenement')
            .then(m => m.ModifierEvenementComponent)
      },

      {
        path: 'sondages',
        loadComponent: () =>
          import('./pages/sondages/sondages')
            .then(m => m.SondagesComponent)
      },
      {
        path: 'sondages/:id',
        loadComponent: () =>
          import('./pages/sondage-detail/sondage-detail')
            .then(m => m.SondageDetailComponent)
      },
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

      {
        path: 'gestion-sondages/:id/resultats',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-sondages/sondage-results/sondage-results')
            .then(m => m.SondageResultsComponent)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then(m => m.ProfileComponent)
      },

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
      {
        path: 'inscriptions-evenement/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/inscriptions-evenement/inscriptions-evenement')
            .then(m => m.InscriptionsEvenement)
      },
      {
        path: 'gestion-inscriptions/:id',
        loadComponent: () =>
          import('./backoffice/amicale/membre-amicale/gestion-inscriptions/gestion-inscriptions')
            .then(m => m.GestionInscriptions)
      },
      {
        path: 'gestion-election/create',
        component: CreateElection
      },
      {
        path: 'gestion-election',
        component: ListElections
      },
      {
        path: 'gestion-election/:id',
        component: ElectionDetail
      },
      {
        path: 'gestion-election/edit/:id',
        component: EditElection
      },
      {
        path: 'elections',
        component: Elections
      },
      {
        path: 'election/:id',
        component: ElectionDetailPublic
      },
      {
        path: 'gestion-election/:id/stats',
        component: ElectionStats
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
  
];