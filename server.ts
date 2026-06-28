import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for Chat and Exam Processing
  app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const rawMessages = req.body.messages;
      let contents: any[] = [];
      if (rawMessages) {
        try {
          contents = JSON.parse(rawMessages);
        } catch (e) {
          console.error("Failed to parse messages JSON", e);
        }
      }
      
      const currentText = req.body.text || '';
      const newParts: any[] = [];
      
      if (currentText) {
        newParts.push({ text: currentText });
      }
      
      if (req.file) {
        const mimeType = req.file.mimetype;
        const base64Data = req.file.buffer.toString('base64');
        newParts.push({ inlineData: { mimeType, data: base64Data } });
      }
      
      if (newParts.length > 0) {
        contents.push({ role: 'user', parts: newParts });
      }

      if (contents.length === 0) {
         res.write(`data: ${JSON.stringify({ error: 'No prompt provided' })}\n\n`);
         res.write('data: [DONE]\n\n');
         res.end();
         return;
      }

      const systemInstruction = `You are an expert tutor and AI assistant for students, named ExamBuddy.
Your primary task is to read uploaded exam papers (images/PDFs) and answer the questions thoroughly and accurately.
You can also chat with the student, answer their follow-up questions, explain concepts, and provide guidance.
Format your responses clearly using Markdown. Use lists, bold text, and math equations where helpful.
Provide answers and chat in Persian (Farsi). Always be encouraging and polite.`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview', // Pro model for better complex reasoning and exam solving
        contents: contents,
        config: {
          systemInstruction,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Error processing chat:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'Failed to process the request' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
