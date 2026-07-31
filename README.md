# 📚 UI Sistema Biblioteca

A modern, reactive Single Page Application (SPA) generated with [Angular CLI](https://github.com/angular/angular-cli) version 21.2.15, designed for efficient book catalog management, user authentication, and profile administration.

This project leverages the latest features of the Angular ecosystem, including **Angular Signals**, a clean architecture based on Core/Features/Shared modules, reactive programming with **RxJS**, and strict adherence to **Web Accessibility (WAI-ARIA)** standards.

---

## 📸 Overview & Features

- **Book Catalog:** Server-side reactive pagination, real-time search with debouncing, and full CRUD operations.
- **Authentication:** Persistent Login system using JWT Tokens handled via HTTP Interceptors.
- **User Profile:** Profile data management seamlessly integrated with the backend API.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Angular 21 (Standalone Components & Signals)
- **State Management & Reactivity:** Angular Signals & RxJS (`Subject`, `switchMap`, `debounceTime`, `distinctUntilChanged`)
- **Styling & UI:** CSS3 Custom Properties, Responsive Layout & Flexbox
- **Security:** JWT Bearer Authentication (`HttpInterceptor` & `CanActivate` Guards)
- **Accessibility (a11y):** WAI-ARIA Standard (`aria-invalid`, `aria-describedby`, `role="alert"`)
- **Testing:** [Vitest](https://vitest.dev/)

### 📂 Project Structure

The codebase follows a scalable modular architecture divided by responsibility:

```text
src/app/
├── core/                  # Global services, security interceptors, and guards
│   ├── guards/            # AuthGuard for route protection
│   ├── interceptors/      # AuthInterceptor for JWT injection
│   └── services/          # AuthService, BookService, etc.
├── features/              # Core feature modules and views
│   ├── auth/              # Login / Register
│   ├── books/             # Catalog, CRUD, and modals
│   ├── profile/           # User profile management
│   └── loans/             # Book loans module
└── shared/                # Data models, interfaces, and reusable components
    ├── components/
    └── models/            # Domain interfaces (Book, User, Request/Response DTOs)
```

---

## 🔥 Key Engineering Highlights

### ⚡ Advanced Reactivity & Prevention of Race Conditions

- **Search Debouncing:** Prevents server overload by delaying API calls by 300ms while typing in the search bar.
- **Stale Request Cancellation:** Implemented `switchMap` in pagination and search flows to automatically cancel pending out-of-date HTTP requests when users interact rapidly.

### ♿ Web Accessibility (a11y)

- Dynamic accessible mapping of backend validation errors using stable element IDs, `aria-describedby`, `aria-invalid`, and `role="alert"` for screen readers.

### 🔐 Security & Error Handling

- **HTTP Interceptor:** Automatically injects the `Authorization: Bearer <TOKEN>` header into all protected API requests.
- **Field-leve Error Handling:** Field-level rendering of backend validation errors.

---

## 🚀 Development Server & Commands

### Prerequisites

- **Node.js**: `^20.19.0`, `^22.12.0`, or `^24.0.0` (Node.js `20.19.0` or higher required)
- **npm**: `v10.x` or higher
- **Angular CLI**: `npm install -g @angular/cli`
- Running Backend API: [api-sistema-biblioteca](https://github.com/fernandogcabal/api-sistema-biblioteca) (Spring Boot)

### Installation & Running

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fernandogcabal/UI-SISTEMA-BIBLIOTECA.git
   cd UI-SISTEMA-BIBLIOTECA
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/` in your browser. The application will automatically reload whenever you modify any source files.

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run `ng generate --help`.

### Building

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

---

## 🧪 Testing & Quality Assurance

### Unit Tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner:

```bash
ng test
```

---

## 🔗 Related Backend Project

This UI application connects to a RESTful API built with Java and Spring Boot. You can check out the server repository here:

- 🐙 **Repository:** [api-sistema-biblioteca](https://github.com/fernandogcabal/api-sistema-biblioteca)

---

## 📖 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
