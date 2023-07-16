const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Get the database and collection
    const db = client.db("StudentManagementSystem");
    const collection = db.collection("Student");

    // Insert a document into the collection
    const result = await collection.insertOne(req.body);
    console.log(`Inserted document with _id: ${result.insertedId}`);

    res.status(201).json({ message: 'Document inserted successfully', insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while inserting the document' });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
