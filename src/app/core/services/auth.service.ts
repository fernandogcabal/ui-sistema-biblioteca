
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  UserRegisterRequest,
  AuthResponse,
  User
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response?.token) {
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
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = token.split('.')[1];

      if (!payload) {
        this.logout();
        return false;
      }

      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      );

      const decodedPayload = JSON.parse(atob(paddedBase64));

      const expiration = decodedPayload.exp;

      if (
        typeof expiration !== 'number' ||
        expiration * 1000 <= Date.now()
      ) {
        this.logout();
        return false;
      }

      return true;

    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
