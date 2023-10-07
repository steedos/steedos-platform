const createServer = require("@steedos/ee_unpkg");

const server = createServer();
const port = process.env.UNPKG_PORT || '3100';

server.listen(port, () => {
  console.log('Unpkg Server listening on port %s, Ctrl+C to quit', port);
});
