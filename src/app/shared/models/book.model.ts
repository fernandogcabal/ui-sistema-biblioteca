import {User} from './user.model';

export type ReadingStatus = 'TO_READ' | 'READING' | 'READ';
export type BookFormat = 'PHYSICAL' | 'EBOOK' | 'AUDIOBOOK';

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  readingStatus: ReadingStatus;
  format: BookFormat;
  available: boolean;
  userId: number; // El ID del usuario que creamos en el backend
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  readingStatus: ReadingStatus;
  format: BookFormat;
  available: boolean;
  user?: User; // Relación relacional mapeada si tu backend la incluye
}