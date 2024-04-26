import { Country } from "./interfaces/country";
import { ProductInterface, ProductRequestItemInterface } from "./interfaces/product"
import { StatisticsInterface } from "./interfaces/statistics"
import { ProductsTradeTotalAmount } from "./service/product.service";




export default class {
    // Шаблон адреса.
    private readonly URL_TEMPLATE: string = "https://oec.world/api/olap-proxy/data?cube=trade_i_baci_a_92&drilldowns=Year,HS4&measures=Trade+Value&parents=true&Year=2021&Exporter+Country=EXPORTER_COUNTRY&Importer+Country=IMPORTER_COUNTRY";

    // Генерирование ссылки для получения статистики экспорта-импорта.
    private GetCurrenCountyUrl(ExportingCountries: Array<Country>, ImportingCountries: Array<Country>): string {
        return this.URL_TEMPLATE
            .replace('EXPORTER_COUNTRY', ExportingCountries.map(country => country.regionPrefix + country.engAbb).join(','))
            .replace('IMPORTER_COUNTRY', ImportingCountries.map(country => country.regionPrefix + country.engAbb).join(','));
    }

    // Получаение статистики из API.
    public async GetTradeStatisics(ExportingCountries: Array<Country>, ImportingCountries: Array<Country>): Promise<StatisticsInterface> {
        let RequestedData: any = null;

        while (true) {
            if (RequestedData) {
                break;
            }
            try {
                let tmp = await fetch(this.GetCurrenCountyUrl(ExportingCountries, ImportingCountries));
                if (tmp.ok) {
                    RequestedData = tmp;
                }
            } catch (e) {
                RequestedData = false;
            }
        }

        RequestedData = await RequestedData.json();
        RequestedData = RequestedData.data;

        // Получаем нужные данные из запроса.
        let data: Array<ProductInterface> = RequestedData.map(item => {
            return {
                name: item["HS4"],
                TradeValue: item["Trade Value"],
                year: item['Year'],
            }
        })


        return {
            ProductsList: data,
            TradeTotalAmount: ProductsTradeTotalAmount(data)
        }
    }
};

