import { Router, Request, Response } from 'express';
import { buildPetitionText, ClientData } from '../utils/petitionTextBuilder';

const router = Router();

// POST /api/petitions/preview
router.post('/preview', (req: Request, res: Response) => {
  try {
    const clientData = req.body.clientData as ClientData;
    const text = buildPetitionText(clientData);
    return res.json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao gerar preview da petição.' });
  }
});

export default router;