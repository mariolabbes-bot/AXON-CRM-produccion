const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runSeed() {
  console.log('Iniciando carga de datos de demostración AXON CRM...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Limpiar la base de datos (Opcional, asume base semi-vacia)
    console.log('1. Limpiando datos existentes...');
    await client.query('TRUNCATE TABLE sales, threats, opportunities, goals, activities, clients, users CASCADE');

    // 2. Crear Usuarios (Manager y Vendedores)
    console.log('2. Creando usuarios demo...');
    const usersQuery = `
      INSERT INTO users (nombre, email, password, rol) VALUES
      ('Manager AXON', 'admin@axoncrm.com', '$2a$10$xyz...', 'manager'),
      ('Vendedor Demo 1', 'vendedor1@axoncrm.com', '$2a$10$xyz...', 'vendedor'),
      ('Vendedor Demo 2', 'vendedor2@axoncrm.com', '$2a$10$xyz...', 'vendedor')
      RETURNING id, email;
    `;
    const { rows: users } = await client.query(usersQuery);
    const idVendedor1 = users.find(u => u.email === 'vendedor1@axoncrm.com').id;

    // 3. Crear Clientes Ficticios
    console.log('3. Creando clientes de prueba...');
    const clientsQuery = `
      INSERT INTO clients (rut, nombre, direccion, ciudad, vendedor_id) VALUES
      ('11111111-1', 'Cliente Demo S.A.', 'Av. Falsa 123', 'Santiago', $1),
      ('22222222-2', 'Comercializadora Prueba', 'Calle Test 456', 'Santiago', $1)
    `;
    await client.query(clientsQuery, [idVendedor1]);

    // 4. Crear Tipos Parametrizables
    console.log('4. Insertando tipos de actividades y metas...');
    await client.query("INSERT INTO activity_types (nombre) VALUES ('Reunión'), ('Visita Terreno') ON CONFLICT DO NOTHING");
    await client.query("INSERT INTO goal_types (nombre) VALUES ('Generar Venta'), ('Seguimiento') ON CONFLICT DO NOTHING");

    await client.query('COMMIT');
    console.log('¡Datos de demostración cargados con éxito! El sistema AXON CRM está listo para su primera Demo.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error durante el seed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

runSeed();
