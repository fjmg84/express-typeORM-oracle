require('dotenv').config();
const express = require('express');
const dataSource = require('./data-source');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Express + PostgreSQL + TypeORM API running' });
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

dataSource.initialize()
  .then(() => {
    console.log('Database connected with TypeORM');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });