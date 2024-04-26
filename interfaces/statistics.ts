import { Country } from "./country"
import { ProductInterface } from "./product"

export interface StatisticsInterface {
    // Список продуктов
    ProductsList: Array<ProductInterface>,

    // Общая сумма продуктов
    TradeTotalAmount: number
};

export interface PartnershipInterface {
    // Страны
    FirstCountry: Country,
    SecondCountry: Country,

    // Статистика
    Statistics: StatisticsInterface,
}