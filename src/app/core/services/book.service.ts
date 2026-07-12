import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, CreateBookRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  // Reemplaza con la URL exacta de tu controlador de libros en Spring Boot
  private apiUrl = 'http://localhost:8080/api/books'; 

  // Obtener todos los libros (El interceptor añadirá el token automáticamente)
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Crear un nuevo libro
  createBook(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  deleteBook(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}