import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AdminUsersComponent } from './backoffice/amicale/admin/users/admin-users';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [

    // ✅ HTTP avec interceptor
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('token');

          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }

          return next(req);
        }
      ])
    ),

    // ✅ Router
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    )

  ]
};