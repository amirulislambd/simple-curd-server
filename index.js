const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://simple-crud-user:ZBDJs8giOaOedKHZ@cluster0.qkd5jcj.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    const db = client.db("simpleCrud");
    const userCollection = db.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/users/:id', async(req, res)=>{
        console.log(req)
        const id = req.params.id;
        const query= {
            _id: new ObjectId(id)
        }
        const user = await userCollection.findOne(query)
        console.log('user id', id)
        res.send(user)
    })

    app.post('/users', async(req, res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser)
      console.log('Data after post:', newUser);
      res.send(result)
    })


    app.delete('/users/:id', async(req, res)=>{
        const id =  req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close()
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple CURD server is Serving");
});

app.listen(port, () => {
  console.log(`Simple CURD server is running on port ${port}`);
});
