const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const recipeController = require('./controllers/recipeController');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/hello', (req, res) => {
  res.send('world');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use((req, res) => {
  res.send("Looks like you're lost...Error 404");
});

app.post('/recipes', recipeController.getRecipes, (req, res) => {
  res.status(200).json({ recipes: res.locals.recipes });
});

app.post('/login', userController.login, (req, res) => {
  res.status(200).cookie('username', req.body.username);
});

app.post('/signup', userController.signup, (req, res) => {
  res.send(200).cookie('username', req.body.username);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`listening on port ${port}`));
