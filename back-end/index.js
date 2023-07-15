const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://sophan:sophan%40123@cluster0.r3agzsk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
  
app.get('/students', async (req, res) => {
    try {
      await client.connect();
      const db = client.db('StudentManagementSystem');
      const students = db.collection('Student');
      const allStudents = await students.find({}).toArray();
      res.json(allStudents);
    } catch (err) {
      console.error(err); // Log the error message to the console
      res.status(500).send('An error occurred while retrieving students');
    }
  });
  

app.post('/students', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('StudentManagementSystem');
    const students = db.collection('Student');
    const newStudent = req.body;
    const insertResult = await students.insertOne(newStudent);
    res.status(201).json(insertResult.ops[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while creating a new student');
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('StudentManagementSystem');
    const students = db.collection('Student');
    const updatedStudent = req.body;
    const updateResult = await students.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedStudent }
    );
    if (updateResult.matchedCount === 0) {
      res.status(404).send('No student found with the given id');
      return;
    }
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the student');
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('StudentManagementSystem');
    const students = db.collection('Student');
    const deleteResult = await students.deleteOne({ _id: new ObjectId(req.params.id) });
    if (deleteResult.deletedCount === 0) {
      res.status(404).send('No student found with the given id');
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the student');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
