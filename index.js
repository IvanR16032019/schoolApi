require('dotenv').config();
const express = require('express');
const pool = require('./db'); // Conexión a PostgreSQL
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); //Para leer solicitudes json

//Rutas CRUD para estudiantes

//Obtener todos los estudiantes
app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//Obtener un estudiante por ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//Agregar un nuevo estudiante (id generado automáticamente)
app.post('/students', async (req, res) => {
  const { name, lastname, age, email, phone_number } = req.body;
  try {
    const newStudent = await pool.query(
      `INSERT INTO students (name, lastname, age, email, phone_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, lastname, age, email, phone_number]
    );
    res.status(201).json(newStudent.rows[0]);
  } catch (error) {
    console.error('Error al agregar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//Editar un estudiante por ID
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, lastname, age, email, phone_number } = req.body;
  try {
    const updatedStudent = await pool.query(
      `UPDATE students SET name = $1, lastname = $2, age = $3, email = $4, phone_number = $5
       WHERE id = $6 RETURNING *`,
      [name, lastname, age, email, phone_number, id]
    );

    if (updatedStudent.rows.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(updatedStudent.rows[0]);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

//Eliminar un estudiante por ID
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (deletedStudent.rows.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json({ message: 'Estudiante eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
