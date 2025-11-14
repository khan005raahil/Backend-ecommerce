import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

// load swagger.yaml
const swaggerDoc = fs.readFileSync(path.join(__dirname, '..', 'swagger.yaml'), 'utf8');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(JSON.stringify(require('js-yaml').load(swaggerDoc)))));

app.use(errorHandler);

export default app;
