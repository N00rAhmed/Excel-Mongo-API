import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || '';

app.use(express.json());
app.use(cors());

let db: MongoClient;

async function connectToMongo() {
  try {
    db = await MongoClient.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

app.post("/api/upload", async (req: Request, res: Response) => {
  try {
    if (!db) {
      await connectToMongo();
    }

    const { mongoURI, collectionName, ...data } = req.body;

    if (typeof collectionName !== 'string') {
      return res.status(400).json({ error: 'Collection Name must be a string' });
    }

    const collection = db.db().collection(collectionName);
    await collection.insertOne(data);

    res.status(200).json({ message: 'Data saved to MongoDB' });
  } catch (err) {
    console.error('Error uploading data to MongoDB:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
