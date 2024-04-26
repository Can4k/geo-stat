import Getter from "./Getter";
import { Country } from "./interfaces/country";
import { ProductInterface } from "./interfaces/product";
import { StatisticsInterface } from "./interfaces/statistics";
import { ProductsTradeTotalAmount } from "./service/product.service";

export default class {
    private __Getter: Getter


    constructor() {
        this.__Getter = new Getter();
    }


    // Скрещивание статистики по продуктам
    private MergeStatisics(...StatisticsList: Array<StatisticsInterface>): StatisticsInterface {
        // Подсчёт общей суммы торговли товаром
        const ProductsContainer = new Map<string, ProductInterface>; 

        StatisticsList.forEach(Statisics => Statisics.ProductsList.forEach(Product => {
            let PreviosState:ProductInterface;

            if (ProductsContainer.has(Product.name)) {
                PreviosState = ProductsContainer.get(Product.name);
            }

            ProductsContainer.set(Product.name, {
                name: Product.name,
                TradeValue: PreviosState?.TradeValue ?? 0 + Product.TradeValue
            });
        }));

        // Собираем статистику 
        return {
            ProductsList: [...ProductsContainer.values()],
            TradeTotalAmount: ProductsTradeTotalAmount([...ProductsContainer.values()])  
        }
    }
    
    // Получение списка товаров экспорта из списка стран в список стран
    public async GetExportStatistics(ExportCountries: Array<Country>, ImportCountries: Array<Country>): Promise<StatisticsInterface> {
        return this.__Getter.GetTradeStatisics(ExportCountries, ImportCountries)   
    }

    // Получение списка товаров импорта из списка стран в список стран
    public async GetImportStatistics(ImportCountries: Array<Country>, ExportCountries: Array<Country>): Promise<StatisticsInterface> {
        return this.GetExportStatistics(ExportCountries, ImportCountries);
    }


    // Получение статистики всей торговли (экспорта-импорта) из списка стран в список стран
    public async GetTradeStatistics(FirstCountries: Array<Country>, SecondContries: Array<Country>): Promise<StatisticsInterface> {
        // Получаем весь товарооборот
        const [
            FirstToSecondExport,
            SecondToFirstExport
        ] = await Promise.all([
            this.GetExportStatistics(FirstCountries, SecondContries),
            this.GetExportStatistics(SecondContries, FirstCountries),
        ]);

        return this.MergeStatisics(FirstToSecondExport, SecondToFirstExport);
    }
}