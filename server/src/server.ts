import http from 'http';
import ExpressApp from './app';
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(ExpressApp);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} 🎉`);
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
});
