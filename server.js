import http from 'http';
import app from './app/app.js';
// Create the server
const PORT = process.env.PORT || 2030;
const server = http.createServer(app);

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});