# Biblioteca Digital - Frontend

Este es el frontend de la aplicación Biblioteca Digital, una aplicación web moderna para gestionar tu colección de libros.

## Características

- 🎨 **Diseño Moderno**: Interfaz limpia y responsive con CSS moderno
- 🔐 **Autenticación**: Sistema de login y registro de usuarios
- 📚 **Gestión de Libros**: Agregar, ver y eliminar libros
- 📱 **Responsive**: Funciona perfectamente en dispositivos móviles y desktop
- 🔔 **Notificaciones**: Sistema de notificaciones toast para feedback del usuario
- ⚡ **Rendimiento**: Carga rápida y experiencia fluida

## Estructura de Archivos

```
frontend/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Este archivo
```

## Funcionalidades

### Autenticación
- **Registro**: Los usuarios pueden crear una nueva cuenta
- **Login**: Iniciar sesión con credenciales existentes
- **Logout**: Cerrar sesión de forma segura
- **Persistencia**: El token de autenticación se mantiene entre sesiones

### Gestión de Libros
- **Ver Libros**: Lista todos los libros del usuario
- **Agregar Libro**: Modal para agregar nuevos libros con:
  - Título (requerido)
  - Autor (requerido)
  - Género (opcional)
  - Año (opcional)
- **Eliminar Libro**: Eliminar libros con confirmación

### Interfaz de Usuario
- **Estados de Carga**: Spinner mientras se cargan los datos
- **Estado Vacío**: Mensaje cuando no hay libros
- **Notificaciones**: Toast notifications para feedback
- **Modal**: Ventana modal para agregar libros
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS y Flexbox/Grid
- **JavaScript ES6+**: Lógica de la aplicación
- **Fetch API**: Comunicación con el backend
- **LocalStorage**: Persistencia del token de autenticación
- **Font Awesome**: Iconos
- **Google Fonts**: Tipografía Inter

## Cómo Usar

1. **Iniciar el Backend**: Asegúrate de que el servidor Node.js esté corriendo en `http://localhost:3000`

2. **Abrir el Frontend**: Abre `index.html` en tu navegador

3. **Registrarse**: Crea una nueva cuenta con usuario y contraseña

4. **Iniciar Sesión**: Usa tus credenciales para acceder

5. **Gestionar Libros**: 
   - Agrega tu primer libro
   - Ve tu biblioteca
   - Elimina libros que ya no necesites

## API Endpoints

El frontend se comunica con los siguientes endpoints del backend:

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /api/libros` - Obtener libros
- `POST /api/libros/agregar` - Agregar libro
- `DELETE /api/libros/eliminar/:id` - Eliminar libro

## Características Técnicas

### Seguridad
- Tokens JWT para autenticación
- Headers de autorización en todas las peticiones
- Validación de formularios en el frontend

### UX/UI
- Diseño centrado en el usuario
- Feedback visual inmediato
- Estados de carga claros
- Confirmaciones para acciones destructivas

### Responsive Design
- Mobile-first approach
- Breakpoints para tablet y desktop
- Grid y Flexbox para layouts adaptativos

## Personalización

### Colores
Los colores se pueden personalizar modificando las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #64748b;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... más variables */
}
```

### Configuración de API
Para cambiar la URL del backend, modifica la constante en `script.js`:

```javascript
const API_BASE_URL = 'http://40.90.234.134:80';
```

## Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Desarrollo

Para desarrollo local:

1. Clona el repositorio
2. Inicia el backend: `npm start`
3. Abre `frontend/index.html` en tu navegador
4. ¡Listo para desarrollar!

## Licencia

Este proyecto es parte de un laboratorio académico. 