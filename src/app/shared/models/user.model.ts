export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string; // Permitimos manejarlo de forma segura en los formularios
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}