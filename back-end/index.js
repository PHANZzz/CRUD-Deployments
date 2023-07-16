
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());

app.post('/api/insert', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('StudentManagementSystem');
    const collection = db.collection('Student');
    const result = await collection.insertOne(req.body);
    res.status(201).json({ message: 'Document inserted successfully', insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while inserting the document' });
  } finally {
    await client.close();
  }
});

app.get('/api/list', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('StudentManagementSystem');
    const collection = db.collection('Student');
    const result = await collection.find({}).toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving documents' });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
