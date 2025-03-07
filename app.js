const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const bodyParser = require('body-parser');

// impoter variable d'environement
require('dotenv').config();
// console.log(process.env);

// Configuration for mongoDB
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à mongoDB réussie !'))
  .catch((error) => console.log({ error }));

const userRoutes = require('./routes/user');
const shopRoutes = require('./routes/loan');
const path = require('path');
const auth = require('./middleware/auth');

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, PATCH, OPTIONS'
//   );
//   next();
// });

app.use(bodyParser.json());

// Route pour renvoyer "hello"
app.get('/hello', (req, res) => {
  res.send('hello');
});

app.get('/', auth);
app.use('/', userRoutes);
app.use('/', shopRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.get('/', (req, res) => {
//   res.send('Hello, this is the homepage!');
// });

module.exports = app;
