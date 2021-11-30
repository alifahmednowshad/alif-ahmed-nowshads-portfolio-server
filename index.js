const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

//middleware
app.use(cors());
app.use(express.json());

//Conect MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1i4nw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const databaase = client.db('my-portfolio');
        const projectsCollection = databaase.collection('projects');

        //GET Projects API
        app.get('/projects', async(req, res) => {
            const cursor = projectsCollection.find({});
            const projects = await cursor.toArray();
            res.send(projects);
        });


        //GET Single Service
        app.get('/projects/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const project = await projectsCollection.findOne(query);
            res.json(project);
        });


    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, host, function() {
    console.log("Server started.......");
  });
