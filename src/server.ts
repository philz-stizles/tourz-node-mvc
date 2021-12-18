import { Express } from 'express';
import http from 'http';
import '../dotenv-config';
import app from '@src/app';
import connectDB from '@src/db';
import initSocketIO from '@src/socket';
// import initGraphQL from '@src/graphql';

const startUp = async (expressApp: Express) => {
  const JWT_AUTH = process.env.JWT_AUTH_SECRET;
  const DB_HOST = process.env.DB_HOST;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const ENV_PORT = process.env.PORT;

  if (!JWT_AUTH) {
    throw new Error('JWT_AUTH_SECRET must be defined');
  }

  if (!DB_HOST || !DB_PASSWORD) {
    throw new Error('DATABASE_HOST & DB_PASSWORD must be defined');
  }

  if (!ENV_PORT || typeof ENV_PORT !== 'string' || isNaN(parseInt(ENV_PORT))) {
    throw new Error('PORT must be defined & must be a number');
  }

  // Connect to database.
  const db = DB_HOST.replace('<PASSWORD>', DB_PASSWORD);
  await connectDB(db);

  // initialize http server
  const httpServer = http.createServer(expressApp); // Now we have our own http instance
  // unlike with express where the server was implicitly create for us

  // Initialize GraphQL
  // initGraphQL(expressApp, httpServer);

  // Initialize Socket.io
  initSocketIO(httpServer);

  const PORT = parseInt(ENV_PORT, 10);
  const server = httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT} ${process.env.NODE_ENV}`);
    console.log(`🚀 API Docs @ http://localhost:${PORT}/api-docs`);
  });

  process.on('unhandledRejection', (err?: Error) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err?.name, err?.message);
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
