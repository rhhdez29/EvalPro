import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

// 1. Creamos la configuración inteligente
const monacoConfig: NgxMonacoEditorConfig = {
  // Si estamos en el navegador, usamos la URL absoluta (ej. http://localhost:4200/assets/...)
  // Si estamos en el servidor de Angular (SSR), usamos la ruta normal para que Node no explote.
  baseUrl: typeof window !== 'undefined'
    ? `${window.location.origin}/assets/monaco/min/vs`
    : '/assets/monaco/min/vs'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()), // usamos el fetch nativo para las peticiones HTTP
    provideHttpClient(withInterceptors([authInterceptor])), //Agregamos el interceptor al HttpClient
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MonacoEditorModule.forRoot(monacoConfig))
  ]
};
