import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // Nombre oficial y estable
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 💡 Le dice a Angular que pinte los datos de forma nativa sin depender de Zone.js
    provideZonelessChangeDetection(), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};