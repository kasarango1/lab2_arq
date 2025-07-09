# Biblioteca Digital - Estructura Actualizada

## 🎯 Aplicación Lista para Usar

### ✅ Estado Actual
- ✅ **Base de datos creada** y funcionando
- ✅ **Tablas configuradas** con tu estructura SQL
- ✅ **Sistema de roles** implementado
- ✅ **Frontend completo** y funcional

## 📊 Estructura de Base de Datos

### Tabla User
```sql
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);
```

### Tabla Book
```sql
CREATE TABLE Book (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  genre VARCHAR(255),
  year INT
);
```

## 🚀 Cómo Usar

### 1. Iniciar Servidor
```bash
node server.js
```

### 2. Probar la Aplicación
- Abre `frontend/index.html` en cualquier navegador
- Inicia sesión con `admin` / `admin123`
- ¡Disfruta de tu biblioteca digital!
- **URL del servidor**: `http://40.90.234.134:80`

## 🔗 Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario (role = 'user')
- `GET /auth/me` - Obtener información del usuario actual
- `PUT /auth/change-password` - Cambiar contraseña

### Libros
- `GET /api/libros` - Obtener todos los libros
- `GET /api/libros/:id` - Obtener libro específico
- `POST /api/libros/agregar` - Agregar libro (requiere auth)
- `PUT /api/libros/actualizar/:id` - Actualizar libro (requiere auth)
- `DELETE /api/libros/eliminar/:id` - Eliminar libro (requiere auth)

## 👥 Sistema de Roles

### Usuario Normal (user)
- ✅ Ver todos los libros
- ✅ Agregar libros
- ✅ Eliminar libros
- ✅ Actualizar libros

### Administrador (admin)
- ✅ Todas las funciones de usuario normal
- ✅ Acceso especial (preparado para futuras funcionalidades)
- ✅ Interfaz diferenciada

## 📝 Ejemplos de Uso

### Registrar Usuario Normal
```bash
curl -X POST http://40.90.234.134:80/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario1","password":"123456"}'
```

### Iniciar Sesión como Admin
```bash
curl -X POST http://40.90.234.134:80/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Agregar Libro (requiere token)
```bash
curl -X POST http://40.90.234.134:80/api/libros/agregar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "El Principito",
    "author": "Antoine de Saint-Exupéry",
    "genre": "Ficción",
    "year": 1943
  }'
```

## 🎨 Interfaz Actualizada

### Características del Frontend
- ✅ **Indicador de rol**: Muestra si eres "Usuario" o "Administrador"
- ✅ **Colores diferenciados**: Admin en rojo, usuario en azul
- ✅ **Funcionalidad completa**: CRUD de libros
- ✅ **Diseño responsive**: Funciona en móvil y desktop

### Elementos Visuales
- **Badge de rol**: Aparece en el header cuando inicias sesión
- **Toast notifications**: Feedback para todas las acciones
- **Modal para agregar libros**: Interfaz intuitiva
- **Confirmaciones**: Para acciones destructivas

## 🔒 Seguridad

### Implementado
- ✅ **JWT Tokens** con expiración de 24h
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **Validación de roles** en el backend
- ✅ **Sanitización de inputs** en queries SQL
- ✅ **Manejo de errores** sin exponer información sensible

### Validaciones
- Usuario mínimo 3 caracteres
- Contraseña mínimo 6 caracteres
- Verificación de existencia antes de operaciones
- Validación de permisos por token

## 📊 Datos de Ejemplo

### Usuario Administrador
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

### Libros de Ejemplo
1. **Cien Años de Soledad** - Gabriel García Márquez (1967)
2. **Don Quijote de la Mancha** - Miguel de Cervantes (1605)
3. **1984** - George Orwell (1949)
4. **Matar a un Ruiseñor** - Harper Lee (1960)
5. **La Casa de los Espíritus** - Isabel Allende (1982)

## 🐛 Troubleshooting

### Error de Conexión
```bash
# Verificar MySQL
mysql -u root -p
SHOW DATABASES;
USE biblioteca_cloud;
SHOW TABLES;
```

### Error de Permisos
```sql
GRANT ALL PRIVILEGES ON biblioteca_cloud.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

## 🎯 Próximas Mejoras

- [ ] Panel de administración para admins
- [ ] Gestión de usuarios (solo admins)
- [ ] Estadísticas de uso
- [ ] Sistema de categorías
- [ ] Búsqueda avanzada
- [ ] Exportación de datos

## 📈 Ventajas de la Estructura

- ✅ **Compatibilidad**: Funciona con tu SQL existente
- ✅ **Escalabilidad**: Sistema de roles preparado
- ✅ **Seguridad**: Validaciones robustas
- ✅ **Rendimiento**: SQL directo sin ORM
- ✅ **Mantenibilidad**: Código limpio y documentado

## 🚀 Estado Final

Tu aplicación está **completamente funcional** con:
- ✅ Backend con SQL directo
- ✅ Frontend moderno y responsive
- ✅ Sistema de autenticación completo
- ✅ Gestión de libros CRUD
- ✅ Sistema de roles implementado
- ✅ Base de datos optimizada

¡Lista para usar en producción! 🎉 