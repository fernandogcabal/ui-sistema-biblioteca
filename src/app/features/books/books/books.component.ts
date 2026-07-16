import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { Book, CreateBookRequest } from '../../../shared/models';
import { HttpClient } from '@angular/common/http'; // Asegura este import arriba
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  // 1. Agrega estas tres variables junto a tus otros signals (books, currentTab, etc.)
  currentPage = signal<number>(0);  // Spring Boot inicia en la página 0
  pageSize = signal<number>(10);   // Límite de 10 elementos por página
  totalPages = signal<number>(0);   // Almacenará el total de páginas que calcule la BD
  // Control de visibilidad del Modal
  isModalOpen = signal<boolean>(false);
  // Nueva variable para saber si estamos editando
  isEditing = signal<boolean>(false);
  editingBookId: number | null = null;
  validationErrors = signal<Record<string, string>>({});
  searchTerm = signal<string>(''); // 💡 Almacena el texto de búsqueda  
  // 💡 Subject para controlar el flujo de escritura
  private searchSubject = new Subject<string>();
  // 💡 Emisor reactivo para la página actual
  private page$ = new Subject<number>();
  
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
    // 1. Configuramos el debounce de la barra de búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTerm.set(value);
      this.currentPage.set(0); // Reseteamos página en el signal
      this.page$.next(0);      // Disparamos la carga para la página 0
    });

    // 2. Controlamos las peticiones HTTP cancelando las obsoletas con switchMap
    this.page$.pipe(
      // switchMap se encarga de cancelar la petición HTTP anterior si llega una nueva
      switchMap((page) => 
        this.bookService.getBooks(page, this.pageSize(), this.searchTerm())
      )
    ).subscribe({
      next: (response) => {
        this.books.set(response.content);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => console.error('Error al cargar libros con switchMap:', err)
    });

    // Carga inicial
    this.page$.next(this.currentPage());
  }
  
  // 💡 Método para alternar las vistas desde el menú lateral
  setView(view: 'libros' | 'perfil'): void {
    this.currentTab.set(view);
    if (view === 'perfil') {
      this.loadUserProfile(); // 💡 Si entra a perfil, traemos los datos reales de la BD
    }
  }
  
loadBooks(): void {
    // Simplemente empujamos la página actual para que el switchMap reaccione y cargue
    this.page$.next(this.currentPage());
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.page$.next(this.currentPage()); // 💡 Gatilla la recarga segura
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.page$.next(this.currentPage()); // 💡 Gatilla la recarga segura
    }
  }
  
  openModal(): void {
    this.isEditing.set(false);
    this.resetForm();
    this.validationErrors.set({});
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
    this.validationErrors.set({});
  }
  
  resetForm(): void {
    this.validationErrors.set({});
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
    // 1. Limpiamos los errores de validación previos antes de cada intento
    this.validationErrors.set({});
    
    if (this.isEditing()) {
      this.bookService.updateBook(this.editingBookId!, this.newBook).subscribe({
        next: () => {
          this.closeModal();
          this.loadBooks();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          // 💡 Si el backend detecta error de validación (400)
          if (err.status === 400 && err.error?.messages) {
            this.validationErrors.set(err.error.messages);
          } else {
            alert(err.error?.message || 'Ocurrió un error inesperado al actualizar.');
          }
        }
      });
    } else {
      this.bookService.createBook(this.newBook).subscribe({
        next: () => {
          this.closeModal();
          this.loadBooks();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          // 💡 Si el backend detecta error de validación (400)
          if (err.status === 400 && err.error?.messages) {
            this.validationErrors.set(err.error.messages);
          } else {
            alert(err.error?.message || 'Ocurrió un error inesperado al guardar.');
          }
        }
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
  
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value); // 💡 Envía el texto al canal con debounce
  }
  
}