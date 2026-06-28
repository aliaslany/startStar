import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import * as admin from 'firebase-admin';
import config from './firebase-applet-config.json';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: config.projectId,
  });
}
const db = admin.firestore();

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

  // Middleware to verify Firebase Auth Token
  const verifyAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying auth token', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };

  // API Route for Add Balance
  app.post('/api/charge', verifyAuth, async (req, res) => {
    try {
      const uid = (req as any).user.uid;
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const userRef = db.collection('users').doc(uid);
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          transaction.set(userRef, { balance: amount, tokensUsed: 0 });
        } else {
          const currentBalance = userDoc.data()?.balance || 0;
          transaction.update(userRef, { balance: currentBalance + amount });
        }
      });
      res.json({ success: true, newBalance: amount }); // In real app, you'd send back the actual new balance
    } catch (error: any) {
      console.error('Charge error:', error);
      res.status(500).json({ error: 'Failed to add balance' });
    }
  });

  // API Route for Get Balance
  app.get('/api/balance', verifyAuth, async (req, res) => {
    try {
      const uid = (req as any).user.uid;
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        // Initial balance for new users
        const initialBalance = 5000;
        await userRef.set({ balance: initialBalance, tokensUsed: 0 });
        return res.json({ balance: initialBalance, tokensUsed: 0 });
      }
      res.json(userDoc.data());
    } catch (error: any) {
      console.error('Get balance error:', error);
      res.status(500).json({ error: 'Failed to get balance' });
    }
  });

  // API Route for Chat and Exam Processing
  app.post('/api/chat', verifyAuth, upload.single('file'), async (req, res) => {
    try {
      const uid = (req as any).user.uid;
      const userRef = db.collection('users').doc(uid);
      
      // Deduct balance check
      const userDoc = await userRef.get();
      const currentBalance = userDoc.data()?.balance || 0;
      const costPerRequest = 1000; // 1000 Tomans per request
      if (currentBalance < costPerRequest) {
        return res.status(402).json({ error: 'موجودی ناکافی. لطفا حساب خود را شارژ کنید.' }); // 402 Payment Required
      }

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

      // Deduct balance
      await userRef.set({
        balance: currentBalance - costPerRequest,
        tokensUsed: admin.firestore.FieldValue.increment(costPerRequest)
      }, { merge: true });

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
