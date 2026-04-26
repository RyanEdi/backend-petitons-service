import dotenv from 'dotenv';
import path from 'path';
import petitionsPreviewRouter from '../routes/petitionsPreview';
import petitionsPdfLibRouter from '../routes/petitionsPdfLib';
import { createBaseApp } from '../shared/createBaseApp';
import { resolvePort } from '../config/http';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = createBaseApp();

app.use('/api/petitions', petitionsPreviewRouter);
app.use('/api/petitions', petitionsPdfLibRouter);

app.get('/health', (_req, res) => {
  res.json({ service: 'petitions-service', status: 'ok' });
});

const PORT = resolvePort('PETITIONS_SERVICE_PORT', 3336);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Petitions service running on port ${PORT}`);
  });
}

export default app;
