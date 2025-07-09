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

exports.getBooks = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, title, author, genre, year FROM Book ORDER BY id DESC'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ 
      error: 'Error al obtener los libros' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

exports.addBook = async (req, res) => {
  let connection;
  try {
    const { title, author, genre, year } = req.body;
    
    // Validaciones
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Título y autor son requeridos' 
      });
    }
    
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO Book (title, author, genre, year) VALUES (?, ?, ?, ?)',
      [title, author, genre || null, year || null]
    );
    
    // Obtener el libro recién creado
    const [newBook] = await connection.execute(
      'SELECT id, title, author, genre, year FROM Book WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error('Error al agregar libro:', error);
    res.status(500).json({ 
      error: 'Error al agregar el libro' 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

exports.deleteBook = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de libro inválido' 
      });
    }
    
    connection = await getConnection();
    
    // Verificar si el libro existe
    const [existingBook] = await connection.execute(
      'SELECT id FROM Book WHERE id = ?',
      [id]
    );
    
    if (existingBook.length === 0) {
      return res.status(404).json({ 
        error: 'Libro no encontrado' 
      });
    }
    
    // Eliminar el libro
    await connection.execute(
      'DELETE FROM Book WHERE id = ?',
      [id]
    );
    
    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).send('Error al eliminar el libro');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función adicional para obtener un libro específico
exports.getBookById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de libro inválido' 
      });
    }
    
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, title, author, genre, year FROM Book WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        error: 'Libro no encontrado' 
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ error: 'Error al obtener el libro' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función para actualizar un libro
exports.updateBook = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, author, genre, year } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        error: 'ID de libro inválido' 
      });
    }
    
    if (!title || !author) {
      return res.status(400).json({ 
        error: 'Título y autor son requeridos' 
      });
    }
    
    connection = await getConnection();
    
    // Verificar si el libro existe
    const [existingBook] = await connection.execute(
      'SELECT id FROM Book WHERE id = ?',
      [id]
    );
    
    if (existingBook.length === 0) {
      return res.status(404).json({ 
        error: 'Libro no encontrado' 
      });
    }
    
    // Actualizar el libro
    await connection.execute(
      'UPDATE Book SET title = ?, author = ?, genre = ?, year = ? WHERE id = ?',
      [title, author, genre || null, year || null, id]
    );
    
    // Obtener el libro actualizado
    const [updatedBook] = await connection.execute(
      'SELECT id, title, author, genre, year FROM Book WHERE id = ?',
      [id]
    );
    
    res.json(updatedBook[0]);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
