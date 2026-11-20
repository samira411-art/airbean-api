import app from './app.js';
import config from './config.js';

app.listen(config.port, () => {
  console.log('Servern körs på http://localhost:' + config.port);
});
