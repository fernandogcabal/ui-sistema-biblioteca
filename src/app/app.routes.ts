import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta pública para Login / Registro
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  
  // Ruta protegida para la gestión de Libros
  { 
    path: 'books', 
    loadComponent: () => import('./features/books/books/books.component').then(m => m.BooksComponent),
    canActivate: [authGuard] // ¡El guardia protege esta pantalla!
  },

  // Redirección por defecto al entrar a la raíz de la app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Comodín para rutas no encontradas (404)
  { path: '**', redirectTo: 'login' }
];