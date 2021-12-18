/* eslint-disable prefer-destructuring */
const http = require('http');
require('dotenv').config({ path: './config.env' });
const app = require('./app');
const connectDB = require('./db/index');
const initSocketIO = require('./socket');
const initGraphQL = require('./graphql');

const startUp = async expressApp => {
  const JWT_AUTH = process.env.JWT_AUTH_SECRET;
  const DB_HOST = process.env.DB_HOST;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  let PORT = process.env.PORT;

  if (!JWT_AUTH) {
    throw new Error('JWT_AUTH_SECRET must be defined');
  }

  if (!DB_HOST || !DB_PASSWORD) {
    throw new Error('DATABASE_URI must be defined');
  }

  if (!PORT || typeof PORT !== 'string' || Number.isNaN(PORT)) {
    throw new Error('PORT must be defined');
  }

  // Connect to database.
  const db = DB_HOST.replace('<PASSWORD>', DB_PASSWORD);
  connectDB(db);

  // initialize http server
  const httpServer = http.createServer(expressApp); // Now we have our own http instance
  // unlike with express where the server was implicitly create for us

  // Initialize GraphQL
  initGraphQL(expressApp, httpServer);

  // Initialize Socket.io
  initSocketIO(httpServer);

  PORT = parseInt(PORT, 10);

  const server = httpServer.listen(PORT, error => {
    if (error) {
      console.log(`Server running on ${PORT}`);
    }

    console.log(`🚀 Server running on ${PORT} ${process.env.NODE_ENV}`);
    console.log(`🚀 API Docs @ http://localhost:${PORT}/api-docs`);
  });

  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

startUp(app);
