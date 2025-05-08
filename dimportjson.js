const fs = require('fs');
const { MongoClient } = require('mongodb');

// Replace with your Atlas URI
const uri = 'mongodb+srv://sushant2507:Cu55J7EeuBAYHjEq@cluster0.xirug.mongodb.net/notesDB?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('notesDB');
    const collection = db.collection('detailednotes');

    const data = JSON.parse(fs.readFileSync('detailednotes.json', 'utf8'));
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
