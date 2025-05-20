import { Router } from "express";
import { getAllProductController } from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/products", getAllProductController);

export default productRouter;
