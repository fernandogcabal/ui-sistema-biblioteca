import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../shared/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Objeto enlazado al HTML por medio de [(ngModel)]
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  // Manejo de estados de error con las nuevas Variables de Control de Angular
  errorMessage: string | null = null;

  onLogin(): void {
    this.errorMessage = null;

    // Validación básica antes de disparar la petición a Java
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Consumimos el servicio HTTP
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('¡Login exitoso! Token guardado.');
        // Redirigimos a la pantalla de libros, la cual ahora nos dejará pasar gracias al Token
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error(err);
        // Si el backend responde con 401 o 403, manejamos el mensaje de forma elegante
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
      }
    });
  }
}