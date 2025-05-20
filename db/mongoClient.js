import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.API;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("electronic");
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("MongoDB connection failed: ", err);
    throw err;
  }
};

export const getDB = () => {
  if (!db) throw new Error("DB not connected.");
  return db;
};

export default connectDB;
