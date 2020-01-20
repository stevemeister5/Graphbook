import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

// Import our Services Object
import services from './services';


const app = express();

const root = path.join(__dirname, '../../');

// Compression setup
app.use(compress());

// Helmet Middleware setup
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "*.amazonaws.com"]
  }
}));

// CORS setup
app.use(cors());

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));


app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'dist/client/index.html'));
});

// Binding Graphql to express web server
const serviceNames = Object.keys(services);

for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.listen(8000, () => console.log('Listening on port 8000!'));
