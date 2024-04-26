export interface ProductInterface {
    // Название 
    name: string,

    // Общая сумма торговли
    TradeValue: number,
}

export interface ProductRequestItemInterface {
    "Year": number,
    "Section ID": number,
    "Section": string,
    "HS2 ID": number,
    "HS2": string,
    "HS4 ID": number,
    "HS4": string,
    "Trade Value": number,
}
