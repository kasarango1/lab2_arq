const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
};

// Función para obtener conexión
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

exports.register = async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'El usuario debe tener al menos 3 caracteres' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    connection = await getConnection();

    // Verificar si el usuario ya existe
    const [existingUsers] = await connection.execute(
      'SELECT id FROM User WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'El usuario ya existe' 
      });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario (por defecto role = 'user')
    await connection.execute(
      'INSERT INTO User (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'user']
    );

    res.status(201).json({ 
      message: 'Usuario registrado correctamente' 
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

exports.login = async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    connection = await getConnection();

    // Buscar el usuario
    const [users] = await connection.execute(
      'SELECT id, username, password, role FROM User WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    const user = users[0];

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        error: 'Contraseña incorrecta' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'tu_secret_key_por_defecto',
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ 
      error: 'Error en el login' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función para verificar token (middleware)
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send('Token no proporcionado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key_por_defecto');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).send('Token inválido');
  }
};

// Función para obtener información del usuario actual
exports.getCurrentUser = async (req, res) => {
  let connection;
  try {
    const userId = req.user.id;

    connection = await getConnection();

    const [users] = await connection.execute(
      'SELECT id, username, role FROM User WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).send('Error al obtener información del usuario');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función para cambiar contraseña
exports.changePassword = async (req, res) => {
  let connection;
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).send('Contraseña actual y nueva contraseña son requeridas');
    }

    if (newPassword.length < 6) {
      return res.status(400).send('La nueva contraseña debe tener al menos 6 caracteres');
    }

    connection = await getConnection();

    // Obtener la contraseña actual
    const [users] = await connection.execute(
      'SELECT password FROM User WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).send('Contraseña actual incorrecta');
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña
    await connection.execute(
      'UPDATE User SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.send('Contraseña actualizada correctamente');
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).send('Error al cambiar la contraseña');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función para verificar si el usuario es admin
exports.requireAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado. Se requieren permisos de administrador');
    }
    next();
  } catch (error) {
    console.error('Error al verificar permisos de admin:', error);
    res.status(403).send('Error al verificar permisos');
  }
};
