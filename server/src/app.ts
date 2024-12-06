import express from 'express';
import router from './routes/router';
import morgan from 'morgan';
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10kb' })); // for parsing application/json, set limit to 10kb
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', router);

export default app;
