import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { Book, CreateBookRequest } from '../../../shared/models';
import { HttpClient } from '@angular/common/http'; // Asegura este import arriba

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private router = inject(Router);
  private http = inject(HttpClient);
private userApiUrl = 'http://localhost:8080/api/users/me';

userProfile = signal({
  username: '',
  email: ''
});

  books = signal<Book[]>([]);
  
  // 💡 Control de pestañas: 'libros' o 'perfil'
  currentTab = signal<'libros' | 'perfil'>('libros');

  // Control de visibilidad del Modal
  isModalOpen = signal<boolean>(false);

  // Nueva variable para saber si estamos editando
  isEditing = signal<boolean>(false);
  editingBookId: number | null = null;

  // Objeto temporal para el formulario
  newBook: CreateBookRequest = {
    title: '',
    author: '',
    isbn: '',
    readingStatus: 'TO_READ',
    format: 'PHYSICAL',
    available: true,
    userId: 1 
  };

  ngOnInit(): void {
    this.loadBooks();
  }

  // 💡 Método para alternar las vistas desde el menú lateral
 setView(view: 'libros' | 'perfil'): void {
  this.currentTab.set(view);
  if (view === 'perfil') {
    this.loadUserProfile(); // 💡 Si entra a perfil, traemos los datos reales de la BD
  }
}

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books.set(data),
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  openModal(): void {
    this.isEditing.set(false);
    this.resetForm();
    this.isModalOpen.set(true);
  }

  openEditModal(book: Book): void {
    this.isEditing.set(true); 
    this.editingBookId = book.id;
    
    this.newBook = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      readingStatus: book.readingStatus as any,
      format: book.format as any,
      available: book.available,
      userId: 1 
    };
    
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  resetForm(): void {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      readingStatus: 'TO_READ',
      format: 'PHYSICAL',
      available: true,
      userId: 1
    };
  }

  onSaveBook(): void {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.isbn) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    if (this.isEditing()) {
      this.bookService.updateBook(this.editingBookId!, this.newBook).subscribe({
        next: () => {
          this.closeModal();
          this.loadBooks();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.bookService.createBook(this.newBook).subscribe({
        next: () => {
          this.closeModal();
          this.loadBooks();
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onDeleteBook(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log(`Libro con ID ${id} eliminado con éxito.`);
          this.loadBooks(); 
        },
        error: (err) => {
          console.error('Error al eliminar el libro:', err);
          alert('No se pudo eliminar el libro.');
        }
      });
    }
  }

  loadUserProfile(): void {
  this.http.get<any>(this.userApiUrl).subscribe({
    next: (data) => {
      this.userProfile.set({
        username: data.username,
        email: data.email
      });
    },
    error: (err) => {
      console.error('Error al obtener perfil desde Spring Boot:', err);
      alert('No se pudo cargar la información del usuario.');
    }
  });
}

onUpdateProfile(): void {
  // Mandamos el objeto modificado al endpoint PUT
  this.http.put<any>(this.userApiUrl, this.userProfile()).subscribe({
    next: (updatedUser) => {
      alert('¡Perfil actualizado con éxito en PostgreSQL!');
      this.userProfile.set({
        username: updatedUser.username,
        email: updatedUser.email
      });
    },
    error: (err) => {
      console.error('Error al actualizar el perfil:', err);
      alert('Ocurrió un error al intentar guardar los cambios.');
    }
  });
}

}