import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload' // ✅ FIX FINAL
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled'
      })
    )
  ]
  
};