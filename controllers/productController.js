import { getDB } from "../db/mongoClient.js";

export const getAllProductController = async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection("product").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch product: ", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
