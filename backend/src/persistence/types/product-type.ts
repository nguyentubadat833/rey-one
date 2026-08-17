import { Loaded } from "@mikro-orm/core";
import { Product } from "../entities/product.entity";

export type ProductLoadedInfo = Loaded<Product, 'info'>