import { ProductInterface } from "../interfaces/product";

export function ProductsTradeTotalAmount(ProductsList: Array<ProductInterface>):number {
    return ProductsList.reduce((prev, Product) => prev + Product.TradeValue, 0);
}