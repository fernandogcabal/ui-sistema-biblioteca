import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, UserRegisterRequest, AuthResponse, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users'; 

  /**
   * Envía las credenciales al backend para iniciar sesión.
   * Si es exitoso, guarda el token JWT en el LocalStorage.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  /**
   * Registra un nuevo usuario en PostgreSQL a través de la API.
   */
  register(user: UserRegisterRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Obtiene el token guardado en el navegador.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica si el usuario tiene una sesión activa basada en la existencia del token.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión destruyendo el token del LocalStorage.
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}