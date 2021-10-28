const app = require('./server');
const config = require('./config');
const { app: { port } } = config;

app.listen(port, () => console.log(`listening on port ${port}`));