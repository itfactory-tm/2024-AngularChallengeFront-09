import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './components/loading-spinner/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
      ])
    ),
    provideAuth0({
      domain: 'dev-m6g4o1k40ifixf7v.us.auth0.com',
      clientId: 'TO9so4JQjZZFod1Vqkuou4hM3hT3k0eU',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ]
};
