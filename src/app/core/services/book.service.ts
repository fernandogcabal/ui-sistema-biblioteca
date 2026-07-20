import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, CreateBookRequest } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/books'; 
  
  // 💡 Modificado para enviar parámetros de paginación (?page=X&size=Y)
  getBooks(page: number, size: number, title?: string): Observable<any> {
    let params = `?page=${page}&size=${size}`;
    if (title && title.trim() !== '') {
      params += `&title=${encodeURIComponent(title)}`;
    }
    return this.http.get<any>(`${this.apiUrl}${params}`);
  }
  
  // Crear un nuevo libro
  createBook(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }
  
  // Eliminar un libro (Cambiamos id a number para hacer match con tu front)
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Actualizar un libro
  updateBook(id: number, book: CreateBookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }
}