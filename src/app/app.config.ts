import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor'; // 🔥 utiliser le vrai fichier

export const appConfig: ApplicationConfig = {
  providers: [

    // 🔥 HTTP + INTERCEPTOR GLOBAL (FIX FINAL)
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // Router
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    )

  ]
};