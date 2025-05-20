import { getDB } from "../db/mongoClient.js";

export const getAllProductController = async (_, res) => {
  try {
    const db = getDB();
    const products = await db.collection("product").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch product: ", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getFilterController = async (req, res) => {
  const {
    category,
    brand,
    ratingMin,
    ratingMax,
    priceMin,
    priceMax,
    discountMin,
    discountMax,
    limited,
    available,
    sortBy = "rating", // ! default sort
    order = "desc", // ! Default order
    limit,
    single,
  } = req.query;

  const query = {};

  // ? Match filters
  if (category) query.categories = category;
  if (brand) query.brand = brand;

  // ? Range filters
  if (ratingMin || ratingMax) {
    query.rating = {};
    if (ratingMin) query.rating.$gte = parseFloat(ratingMin);
    if (ratingMax) query.rating.$lte = parseFloat(ratingMax);
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = parseFloat(priceMin);
    if (priceMax) query.price.$lte = parseFloat(priceMax);
  }

  if (discountMin || discountMax) {
    query.discount = {};
    if (discountMin) query.discount.$gte = parseFloat(discountMin);
    if (discountMax) query.discount.$lte = parseFloat(discountMax);
  }

  // ? Boolean filters
  if (limited !== undefined) query.limited = limited === "true";
  if (available !== undefined) query.available = available === "true";

  // ? Validate there's at least one filter
  if (Object.keys(query).length === 0) {
    return res
      .status(400)
      .json({ warning: "At least one filter must be provided." });
  }

  try {
    const db = getDB();
    const collection = db.collection("product");

    const sortOption = {};
    sortOption[sortBy] = order === "asc" ? 1 : -1;

    const cursor = collection.find(query).sort(sortOption);

    if (single === "true") {
      const result = await cursor.limit(1).toArray();
      return res.status(200).json(result[0] || {});
    }

    if (limit) cursor.limit(parseInt(limit));

    const results = await cursor.toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error("Filter failed:", error);
    res.status(500).json({ error: "Failed to filter products" });
  }
};
