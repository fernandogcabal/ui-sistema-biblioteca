
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users/me';

  // Signal para manejar los datos del usuario en el formulario
  userProfile = signal({
    username: '',
    email: ''
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // Tu interceptor adjuntará el token JWT de forma automática aquí también
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.userProfile.set({
          username: data.username,
          email: data.email
        });
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  onUpdateProfile(): void {
    this.http.put<any>(this.apiUrl, this.userProfile()).subscribe({
      next: (updatedData) => {
        alert('¡Perfil actualizado con éxito!');
        this.userProfile.set({
          username: updatedData.username,
          email: updatedData.email
        });
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Hubo un error al guardar los cambios.');
      }
    });
  }
}