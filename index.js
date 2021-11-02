require('app-module-path').addPath(__dirname);

require('dotenv').config();
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

const server = require('./server');

const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
