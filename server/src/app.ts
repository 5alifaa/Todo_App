import express from 'express';
import router from './routes/router';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', router);

export default app;
