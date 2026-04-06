import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    // 🔥 HTTP + INTERCEPTOR
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 🔥 ROUTER PRO CONFIG
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    )

  ]
};