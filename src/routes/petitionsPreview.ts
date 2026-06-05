import { Router, Request, Response } from 'express';
import { buildPetitionText, ClientData } from '../utils/petitionTextBuilder';

const router = Router();

// Rota POST de pre-visualizacao de peticoes
router.post('/preview', (req: Request, res: Response) => {
  try {
    const clientData = req.body.clientData as ClientData;
    const text = buildPetitionText(clientData);
    return res.json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao gerar pre-visualizacao da peticao.' });
  }
});

export default router;