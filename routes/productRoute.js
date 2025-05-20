import { Router } from "express";
import {
  getAllProductController,
  getFilterController,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/products", getAllProductController);
productRouter.get("/product/filter", getFilterController);

export default productRouter;
