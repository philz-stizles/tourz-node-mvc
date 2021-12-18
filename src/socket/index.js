const { Server: SocketServer } = require('socket.io');
const { createMessage, readMessage } = require('./handlers/message.handler');

module.exports = server => {
  const io = new SocketServer(server, {
    // pingTimeout is used in the heartbeat mechanism, which periodically
    // checks if the connection is still alive between the server and the client.
    // The server sends a ping, and if the client does not answer with a pong
    // within pingTimeout ms, the server considers that the connection is closed.
    pingTimeout: 30000,
    cors: {
      origin: process.env.SOCKET_CORS_ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
      // allowedHeaders: ['my-custom-header'],
      // credentials: true,
    },
  });

  const onConnection = socket => {
    console.log('Connected to Socket');
    socket.on('message:create', createMessage);
    socket.on('message:read', readMessage);

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  };

  io.on('connection', onConnection);

  io.on('error', err => {
    console.log('Connection error!!!', err.message);
  });
};
