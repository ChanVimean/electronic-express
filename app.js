import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB, { getDB } from "./db/mongoClient.js";
import productRouter from "./routes/productRoute.js";

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

// ! Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ? Starting Server
const Server = async () => {
  try {
    // ? Connecting to Database
    await connectDB();

    // ! Testing Server
    app.use("/testing", async (_, res) => {
      try {
        const db = getDB();
        await db.command({ ping: 1 });
        res.status(200).send("Server & Database are connected!");
      } catch (error) {
        console.error("DB ping failed: ", error);
        res.status(500).send("Server is running but DB connection failed.");
      }
    });

    // ? Routes
    app.use("/electronic", productRouter);

    // ! Running Server
    app.listen(port, () =>
      console.log(`Server is running on http://${host}:${port}`)
    );
  } catch (error) {
    console.error("Failed to start server: ", error);
  }
};

Server();
