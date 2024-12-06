import http from 'http';
import ExpressApp from './app';
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(ExpressApp);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} 🎉`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  if (err instanceof Error) {
    console.log(err.name, err.message);
  } else {
    console.log('Unknown error', err);
  }
  server.close(() => {
    process.exit(1);
  });
});
