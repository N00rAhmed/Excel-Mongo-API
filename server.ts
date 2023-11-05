// File: server.js

const express = require('express');
import { Request, Response } from 'express';

const bodyParser = require('body-parser');
var cors = require('cors');

const { MongoClient } = require('mongodb');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

// let client = null;
// let client: MongoClient | null = null;
let client: typeof MongoClient | null = null;



app.post('/send-message', async (req: Request, res: Response) => {
  try {
    const { mongoUri, message } = req.body;

    if (!mongoUri || !message) {
      return res.status(400).json({ error: 'MongoDB URI and message are required' });
    }

    if (!client) {
      client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
    }

    const db = client.db();
    const messagesCollection = db.collection('messages');

    const result = await messagesCollection.insertOne({ text: message });
    res.status(201).json({ message: 'Message sent to MongoDB collection', insertedId: result.insertedId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
