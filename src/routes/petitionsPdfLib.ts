import { Router, Request, Response } from 'express';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { buildPetitionText, ClientData } from '../utils/petitionTextBuilder';

const router = Router();
const CM = 28.3465;
const MARGINS = {
  top: 3 * CM,
  bottom: 2 * CM,
  left: 3 * CM,
  right: 2 * CM,
};

// POST /api/petitions/pdf-advanced
router.post('/pdf-advanced', async (req: Request, res: Response) => {
  try {
    const clientData = req.body.clientData as ClientData;
    const fullText = buildPetitionText(clientData);

    const firstPassDoc = await PDFDocument.create();
    const timesRoman = await firstPassDoc.embedFont(StandardFonts.TimesRoman);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const fontSize = 12;
    const lineHeight = fontSize * 1.5;

    const maxWidth = pageWidth - MARGINS.left - MARGINS.right;
    const maxHeight = pageHeight - MARGINS.top - MARGINS.bottom;
    const linesPerPage = Math.floor(maxHeight / lineHeight);

    const paragraphs = fullText.split('\n');
    let currentPage = firstPassDoc.addPage([pageWidth, pageHeight]);
    let cursorY = pageHeight - MARGINS.top;
    let currentLineInPage = 0;

    const wrapText = (text: string): string[] => {
      if (!text) return [''];
      const words = text.split(' ');
      const lines: string[] = [];
      let line = '';

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const width = timesRoman.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    for (const paragraph of paragraphs) {
      const lines = wrapText(paragraph);

      for (const line of lines) {
        if (currentLineInPage >= linesPerPage) {
          currentPage = firstPassDoc.addPage([pageWidth, pageHeight]);
          cursorY = pageHeight - MARGINS.top;
          currentLineInPage = 0;
        }

        currentPage.drawText(line, {
          x: MARGINS.left,
          y: cursorY,
          size: fontSize,
          font: timesRoman,
        });

        cursorY -= lineHeight;
        currentLineInPage += 1;
      }

      if (currentLineInPage >= linesPerPage) {
        currentPage = firstPassDoc.addPage([pageWidth, pageHeight]);
        cursorY = pageHeight - MARGINS.top;
        currentLineInPage = 0;
      } else {
        cursorY -= lineHeight;
        currentLineInPage += 1;
      }
    }

    const pdfBytesFirst = await firstPassDoc.save();
    const secondPassDoc = await PDFDocument.load(pdfBytesFirst);
    const footerFont = await secondPassDoc.embedFont(StandardFonts.Helvetica);
    const totalPages = secondPassDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = secondPassDoc.getPage(i);

      // Cabeçalho
      page.drawText('Petição Inicial - Aposentadoria PCD', {
        x: MARGINS.left,
        y: pageHeight - 40,
        size: 9,
        font: footerFont,
        color: rgb(0, 0, 0),
      });

      // Rodapé
      const footerText = `Página ${i + 1} de ${totalPages}`;
      const textWidth = footerFont.widthOfTextAtSize(footerText, 9);
      const xFooter = (pageWidth - textWidth) / 2;

      page.drawText(footerText, {
        x: xFooter,
        y: MARGINS.bottom / 2,
        size: 9,
        font: footerFont,
        color: rgb(0, 0, 0),
      });
    }

    const finalBytes = await secondPassDoc.save();

    res
      .status(200)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Length': finalBytes.length,
        'Content-Disposition': 'attachment; filename="peticao_inicial.pdf"',
      })
      .send(Buffer.from(finalBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar PDF com pdf-lib.' });
  }
});

export default router;