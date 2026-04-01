import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EventsComponent } from './pages/evenements/evenements';
import { GestionEvenementsComponent } from './backoffice/amicale/gestion-evenements/gestion-evenements';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [

  // 🔐 LOGIN
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

  // 🔐 APP PROTECTED
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      // 📊 DASHBOARD
      { path: 'dashboard', component: DashboardComponent },

      // 📅 TOUS LES EVENEMENTS (adhérent)
      { path: 'evenements', component: EventsComponent },

      // ➕ CREATION EVENEMENT (amicale)
      { path: 'gestion-evenements', component: GestionEvenementsComponent },

      // 👤 MES EVENEMENTS (adhérent)
      {
        path: 'mes-evenements',
        loadComponent: () =>
          import('./backoffice/amicale/evenements/mes-evenements/mes-evenements')
            .then(m => m.MesEvenementsComponent)
      },

      // 🟢 MES EVENEMENTS (membre amicale)
      {
        path: 'mes-evenements-amicale',
        loadComponent: () =>
          import('./backoffice/amicale/evenements/mes-evenements-membre-amicale/mes-evenements-membre-amicale')
            .then(m => m.MesEvenementsMembreAmicaleComponent)
      },

      // 👤 PROFILE
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