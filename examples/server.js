import path from 'path';
import Polonez from 'polonez';
import ServeStatic from 'serve-static';
import compression from 'compression';

const polonez = Polonez();
polonez.use(compression());
polonez.use(ServeStatic(path.resolve('./')));

let port = 8080;
if (process.argv.length > 2) {
  port = Number(process.argv[2]);
}
if (process.env.PORT) {
  port = Number(process.env.PORT);
}
polonez.listen(port);
console.log(`Visit: http://localhost:${port}/examples/index.html`); // eslint-disable-line no-console
