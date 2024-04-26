
# geo-stat!


Мной был разработан небольшой сервис для визуализации торговых связей, который использует API этого  [сервиса](https://oec.world).

В качестве пропса принимается карта и её описания, а в ответ сервис создает **HTML** файл с изображением карты и нанесенной на не метрикой. 

[Пример исследования](https://docs.google.com/presentation/d/1lFXnC757BKU5GM0RU6lJtbRIPMnrC0HbPXqCMLfLjEw/edit?usp=sharing)

## Конфигурация
В папке `config` находится два файла конфигурации, `app.config.json` и `map.config.json` 

### app.config.json

- `outputFolder` - путь к папке, в которую будет генерироваться html с изображением
- `outputFilename` - название генерируемого файла  
- `assetsFolder` - путь к папке с ассетами (картами)
- `mode: "absolute" | "greatest"` - режим графика
-- `absolute` будут демонстрироваться все торговые связи, прозрачность отрезка между странами A, B будет равна `(TRADE(A, B) / MAX_TRADE)`
--`greatest` для каждой страны будет демонстрироваться самая крупная торговая связь с ровно одним партнером 

### map.config.json

**Свойства изображения**
- `imageProperties.heigth` - высота генерируемого изображения 
- `imageProperties.width` - ширина генерируемого изображения
- `imageProperties.imageName` - имя файла с изображением карты

**Свойства отметок**
- `marks.dotWidth` - ширина отметки страны
- `marks.dotHeight` - высота отметки страны
- `marks.dotFillStyle` - **HEX** заливки отметки
- `marks.fontShiftX` - отступ по оси **X** от отметки до текста
- `marks.fontShiftY` - отступ по оси **Y** от отметки до текста
- `marks.font` - шрифт подписи стран
- `marks.fontFillStyle` - цвет шрифта подписей стран
- 
**Страны**
`countries: [Country]` - список стран в особом формате:
- `Country.regionPrefix` - регион страны *(na, eu..)* 
- `Country.engAbb` - аббревиатура страны 
- `Country.locatedName` - подпись страны, которая будет выводиться
- `Country.cords.x` - позиция отметки по оси **X**
- `Country.cords.y` - позиция отметки по оси **Y**
- `Country.mode: "left" | "right"` с какой стороны от отметки будет подпись страны 

## Установка & запуск
I. Установка **typescript** и его исполнителя
`$ npm install -D typescript`
`$ npm install -D ts-node`

II. Запуск скрипта
`$ npx ts-node script.ts`