import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta pública para Login / Registro
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  
  // 📚 Ruta Protegida del Dashboard Principal (Libros + Perfil dinámico)
  {
    path: 'books',
    loadComponent: () => import('./features/books/books/books.component').then(m => m.BooksComponent),
    canActivate: [authGuard] // 🛡️ El guardia protege todo el panel de control
  },

  // Redirección por defecto al entrar a la raíz de la app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Comodín para rutas no encontradas (404) o enlaces rotos
  { path: '**', redirectTo: 'login' }
];