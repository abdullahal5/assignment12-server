const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from  Server..");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zelnjpd.mongodb.net`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB!");

    const newCollection = client.db("HostelMeasl").collection("new");
    const membershipCollection = client
      .db("HostelMeasl")
      .collection("membership");
    const categoryCollection = client.db("HostelMeasl").collection("category");
    const paymentCollection = client.db("HostelMeasl").collection("payment");
    const requestCollection = client.db("HostelMeasl").collection("request");
    const reviewCollection = client.db("HostelMeasl").collection("review");
    const usersCollection = client.db("HostelMeasl").collection("users");
    const upcomingCollection = client.db("HostelMeasl").collection("upcoming");

    app.get("/new", async (req, res) => {
      const result = await newCollection.find().toArray();
      res.send(result);
    });
    app.get("/membership", async (req, res) => {
      const result = await membershipCollection.find().toArray();
      res.send(result);
    });
    app.get("/category", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });
    app.post("/category", async (req, res) => {
      const body = req.body;
      console.log(body);
      const result = await categoryCollection.insertOne(body);
      res.send(result);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });
    app.get("/category", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      // console.log(price)
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      // console.log(payment)
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    });
    app.get("/payments/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/payments", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.send(result);
    });
    app.post("/request", async (req, res) => {
      const body = req.body;
      const result = await requestCollection.insertOne(body);
      res.send(result);
    });
    app.get("/request", async (req, res) => {
      const result = await requestCollection.find().toArray();
      res.send(result);
    });
    app.get("/request/:email", async (req, res) => {
      const query = { email: req.params.email };
      console.log(query);
      const result = await requestCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/request/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/review", async (req, res) => {
      const body = req.body;
      //  console.log(body);
      const result = await reviewCollection.insertOne(body);
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.post("/upcoming", async (req, res) => {
      const body = req.body;
      const result = await upcomingCollection.insertOne(body);
      res.send(result);
    });
    app.get("/upcoming", async (req, res) => {
      const result = await upcomingCollection.find().toArray();
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.patch("/category/:id", async (req, res) => {
      const body = req.body;
      console.log(body.totalLikes);
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          likes: "1",
        },
      };
      const result = await categoryCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from HostelHeaven.");
});

app.listen(port, () => {
  console.log(`Hostel and Meals is running on port ${port}`);
});

