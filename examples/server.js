const version = Number(process.version.split('.')[0].replace(/\D/gi, ''));

if (version < 11) {
  console.error('You need at least nodejs version 11 or higher.');
  process.exit();
}

const path = require('path');
const Polonez = require('polonez');
const ServeStatic = require('serve-static');

const polonez = Polonez();
polonez.use(ServeStatic(path.resolve('./examples')));
polonez.use(ServeStatic(path.resolve('./dist')));

let port = 8080;
if (process.argv.length > 2) {
  port = Number(process.argv[2]);
}
if (process.env.PORT) {
  port = Number(process.env.PORT);
}
polonez.listen(port);
console.log(`Visit: http://localhost:${port}/index.html`); // eslint-disable-line no-console
