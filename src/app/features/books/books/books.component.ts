import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡Importante para los formularios!
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { Book, CreateBookRequest, BookFormat, ReadingStatus } from '../../../shared/models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadimos FormsModule aquí
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private router = inject(Router);

  books = signal<Book[]>([]);
  
  // Control de visibilidad del Modal
  isModalOpen = signal<boolean>(false);

  // 💡 Nueva variable para saber si estamos editando
  isEditing = signal<boolean>(false);
  editingBookId: number | null = null;

  // Objeto temporal para el formulario basado en tu CreateBookRequest
  newBook: CreateBookRequest = {
    title: '',
    author: '',
    isbn: '',
    readingStatus: 'TO_READ',
    format: 'PHYSICAL',
    available: true,
    userId: 1 // Por ahora quemado, luego se puede extraer del token si el backend lo requiere
  };

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books.set(data),
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  openModal(): void {
    this.resetForm();
    this.isModalOpen.set(true);
  }

  // 💡 Función nueva para abrir el modal en modo edición
  openEditModal(book: Book): void {
    this.isEditing.set(true); // Estamos editando
    this.editingBookId = book.id;
    
    // Rellenamos el formulario con los datos actuales del libro
    this.newBook = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      readingStatus: book.readingStatus as any,
      format: book.format as any,
      available: book.available,
      userId: 1 // O el ID correspondiente
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
      // 📝 MODO EDICIÓN: Petición PUT
      this.bookService.updateBook(this.editingBookId!, this.newBook).subscribe({
        next: () => {
          this.closeModal();
          this.loadBooks();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      // ➕ MODO CREACIÓN: Petición POST
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
  // Una confirmación nativa rápida para evitar accidentes
  if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
    // Nota: Asegúrate de que tu BookService tenga el método deleteBook(id)
    // Si no lo tiene, puedes agregar en tu book.service.ts: deleteBook(id) { return this.http.delete(`${this.apiUrl}/${id}`); }
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        console.log(`Libro con ID ${id} eliminado con éxito.`);
        // Recargamos la lista desde el backend para actualizar la tabla inmediatamente
        this.loadBooks(); 
      },
      error: (err) => {
        console.error('Error al eliminar el libro:', err);
        alert('No se pudo eliminar el libro.');
      }
    });
  }
}
}