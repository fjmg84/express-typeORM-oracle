require('dotenv').config();
const express = require('express');
const dataSource = require('./data-source');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Express + Oracle + TypeORM API running' });
});

app.get('/health', async (req, res) => {
  try {
    await dataSource.query('SELECT 1 FROM DUAL');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await dataSource.getRepository('User').find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await dataSource.getRepository('User').create({ name, email });
    const result = await dataSource.getRepository('User').save(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function setupDatabase() {
  const oracledb = require('oracledb');
  let connection;
  try {
    console.log('Connecting as system to create user...');
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'apppassword',
      connectString: `${process.env.DB_HOST || 'oracle'}:${process.env.DB_PORT || 1521}/${process.env.DB_SERVICE || 'XE'}`
    });

    const result = await connection.execute(
      `SELECT COUNT(*) as cnt FROM dba_users WHERE username = 'APP_USER'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows[0].CNT === 0) {
      console.log('Creating user app_user...');
      await connection.execute(`CREATE USER app_user IDENTIFIED BY "${process.env.DB_PASSWORD || 'apppassword'}" DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP QUOTA UNLIMITED ON USERS`, [], { autoCommit: true });
      await connection.execute(`GRANT CONNECT, RESOURCE TO app_user`, [], { autoCommit: true });
      console.log('User app_user created successfully');
    } else {
      console.log('User app_user already exists');
    }
  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    if (connection) await connection.close();
  }
}

dataSource.initialize()
  .then(async () => {
    console.log('Database connected with TypeORM');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error('Database connection failed, attempting to create user...');
    await setupDatabase();

    console.log('Retrying connection...');
    try {
      await dataSource.initialize();
      console.log('Database connected with TypeORM after user creation');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (retryErr) {
      console.error('Database connection failed after retry:', retryErr);
      process.exit(1);
    }
  });