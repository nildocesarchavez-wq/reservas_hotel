# 🏨 Reservas Hotel - Sistema de Gestión de Reservas

Sistema completo para la gestión de reservas de hotel, desarrollado como una Single Page Application (SPA) moderna. Permite a los clientes reservar habitaciones y a los administradores gestionar el hotel a través de un panel de control.

## 🚀 Tecnologías y Herramientas

*   **Frontend**: [Angular v17+](https://angular.io/) (Standalone Components, Signals)
*   **Lenguaje**: TypeScript
*   **Backend / Base de Datos**: Firebase (Firestore Database, Authentication)
*   **Hosting**: Firebase Hosting
*   **Estilos**: CSS3 Moderno (Diseño Responsivo)
*   **Control de Versiones**: Git

## 📋 Requisitos de Instalación y Ejecución

Para ejecutar este proyecto localmente, necesitas tener instalado [Node.js](https://nodejs.org/) (v18 o superior) y Angular CLI.

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd reservas_hotel
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Firebase**
    *   Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
    *   Habilita **Authentication** (Email/Password).
    *   Habilita **Firestore Database**.
    *   Copia tus credenciales y configúralas en `src/environments/environment.ts`.

4.  **Ejecutar servidor de desarrollo**
    ```bash
    ng serve
    ```
    La aplicación estará disponible en `http://localhost:4200/`.

## 🏗️ Arquitectura del Sistema

La aplicación sigue una arquitectura modular basada en componentes independientes (Standalone Components).

### 📂 Estructura Principal
*   **`src/app/nucleo`**: Contiene la lógica de negocio central.
    *   **`servicios/`**: Comunicación con Firebase (Auth, Firestore) y gestión de estado.
    *   **`modelos/`**: Interfaces TypeScript para tipado fuerte (Usuario, Reserva, Habitacion).
    *   **`guards/`**: Protección de rutas (AuthGuard, AdminGuard).
*   **`src/app/paginas`**: Vistas principales de la aplicación.
    *   **`publico/`**: Vistas accesibles para todos (Inicio, Habitaciones, Contacto).
    *   **`cliente/`**: Panel del cliente (Mis Reservas, Perfil).
    *   **`administrador/`**: Panel de gestión (Dashboard, Reservas, Habitaciones, Usuarios).
*   **`src/app/compartido`**: Componentes reutilizables (Header, Footer, Sidebar).

### 🔒 Servicios Principales
*   **`AuthService`**: Manejo de sesión, registro y login.
*   **`ReservasService`**: CRUD de reservas en Firestore.
*   **`HabitacionesService`**: Gestión del inventario de habitaciones.

## 🌐 Despliegue (Deploy)

La aplicación está desplegada y accesible públicamente en Firebase Hosting:

🔗 **URL del Proyecto**: [https://reservashotel-69246.web.app](https://reservashotel-69246.web.app)

## 🎥 Video Demostrativo

Video explicativo de 5 a 8 minutos cubriendo funcionalidades, autenticación, base de datos y código.

▶️ **Ver Video**: 

🔗 **URL del video** [Ver Video](https://drive.google.com/drive/folders/1VFTQwJ17-bSeyUhvxxf655F2g1H1-6mKp)

## 📖 Manual de Usuario

### Para Clientes
1.  **Registro/Login**: Cree una cuenta o inicie sesión para realizar reservas.
2.  **Explorar Habitaciones**: Navegue por la página de "Habitaciones" para ver detalles y fotos.
3.  **Reservar**: Seleccione fechas y habitación. Si está disponible, confirme su reserva.
4.  **Mis Reservas**: Consulte el estado de sus reservas en su panel personal.

### Para Administradores
1.  **Acceso Admin**: Inicie sesión con una cuenta de rol administrador.
2.  **Dashboard**: Visualice métricas rápidas (reservas del día, ingresos).
3.  **Gestión de Reservas**: Apruebe, cancele o modifique reservas pendientes.
4.  **Gestión de Habitaciones**: Agregue nuevas habitaciones, edite precios o cambie la disponibilidad.
5.  **Usuarios**: Gestione las cuentas de acceso al sistema.
