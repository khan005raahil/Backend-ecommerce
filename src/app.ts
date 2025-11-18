import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

// Security + parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health root (fixes "Cannot GET /")
app.get('/', (_req, res) => {
  res.send('E-commerce API is running. Visit /api or /docs');
});

// Mount API routes
app.use('/api', routes);

// load swagger.yaml (kept in your one-liner style but made TypeScript-safe)
try {
  const swaggerPath = path.join(__dirname, '..', 'swagger.yaml');
  if (fs.existsSync(swaggerPath)) {
    const swaggerDoc = fs.readFileSync(swaggerPath, 'utf8');
    // keep your compact JSON.parse(JSON.stringify(...)) approach and cast to any for TS
    app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(
        JSON.parse(JSON.stringify(require('js-yaml').load(swaggerDoc))) as any
      )
    );
  } else {
    console.warn('Swagger file not found at', path.join(__dirname, '..', 'swagger.yaml'));
  }
} catch (err) {
  console.warn('Failed to load swagger.yaml:', err);
}

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
