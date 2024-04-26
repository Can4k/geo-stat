const { createCanvas, loadImage } = require('canvas')
import { generateImage } from "./html.service";
import mapConfig from "../config/map.config.json";
import appConfig from "../config/app.config.json";
import { Country } from "../interfaces/country";
import Experement from "../Experement";

export class canvasService {
  __Canvas: HTMLCanvasElement
  __ctx: CanvasRenderingContext2D

  constructor() {
    this.__Canvas = createCanvas(mapConfig.imageProperties.height, mapConfig.imageProperties.width);
    this.__ctx = this.__Canvas.getContext("2d");
  }

  async drawMap() {
    const img = await loadImage(appConfig.assetsFolder + mapConfig.imageProperties.imageName);
    this.__ctx.drawImage(img, 0, 0);
  }

  async drawCountry(country: Country) {
    this.__ctx.font = mapConfig.marks.font;

    if (country.mode === "left") {
      const textWidth = this.__ctx.measureText(country.locatedName).width;
      const textX = country.cords.x + mapConfig.marks.dotHeight - mapConfig.marks.fontShiftX - textWidth;

      this.__ctx.fillStyle = mapConfig.marks.fontFillStyle;
      this.__ctx.fillText(
        country.locatedName,
        textX,
        country.cords.y + mapConfig.marks.fontShiftY
      );

      this.__ctx.fillStyle = mapConfig.marks.dotFillStyle;
      this.__ctx.fillRect(
        country.cords.x,
        country.cords.y,
        mapConfig.marks.dotHeight,
        mapConfig.marks.dotWidth
      );
    } else if (country.mode === "right") {
      this.__ctx.fillStyle = mapConfig.marks.fontFillStyle;
      this.__ctx.fillText(
        country.locatedName,
        country.cords.x + mapConfig.marks.fontShiftX,
        country.cords.y + mapConfig.marks.fontShiftY
      );

      this.__ctx.fillStyle = mapConfig.marks.dotFillStyle;
      this.__ctx.fillRect(
        country.cords.x,
        country.cords.y,
        mapConfig.marks.dotHeight,
        mapConfig.marks.dotWidth
      );
    }
  }

  async drawTrade(A: Country, B: Country, transparet: number): Promise<void> {
    this.__ctx.beginPath();
    this.__ctx.globalAlpha = transparet;
    this.__ctx.moveTo(A.cords.x + mapConfig.marks.dotWidth * 0.5, A.cords.y + mapConfig.marks.dotHeight * 0.5);
    this.__ctx.lineTo(B.cords.x + mapConfig.marks.dotWidth * 0.5, B.cords.y + mapConfig.marks.dotHeight * 0.5);
    this.__ctx.stroke();
  }


  getImage() {
    return '<img src="' + this.__Canvas.toDataURL() + '" />';
  }
}

export async function drawCanvas() {
  const Canvas = new canvasService();
  await Canvas.drawMap();

  for (const country of mapConfig.countries) {
    Canvas.drawCountry(country);
  }

  let maxCountryTrade = new Map<string, Country>();
  let trades = {};
  let maxTrade = 0;
  let it = 0;

  for (let i = 0; i < mapConfig.countries.length; i++) {
    for (let j = 0; j < mapConfig.countries.length; j++) {
      let A = mapConfig.countries[i];
      let B = mapConfig.countries[j];

      new Experement().GetTradeStatistics([A], [B]).then(trade => {
        trades[A.engAbb + B.engAbb] = trades[B.engAbb + A.engAbb] = trade.TradeTotalAmount;
        maxTrade = Math.max(maxTrade, trade.TradeTotalAmount);

        if (++it !== mapConfig.countries.length * mapConfig.countries.length) {
          return;
        }

        for (let i = 0; i < mapConfig.countries.length; i++) {
          for (let j = 0; j < mapConfig.countries.length; j++) {
            let A = mapConfig.countries[i];
            let B = mapConfig.countries[j];

            if (appConfig.mode === "absolute") {
              Canvas.drawTrade(A, B, trades[A.engAbb + B.engAbb] / maxTrade);
            }
          }
        }

        if (appConfig.mode === "greatest") {
          for (const country of mapConfig.countries) {
            maxCountryTrade[country.engAbb] ??= country;

            for (const partner of mapConfig.countries) {
              const pts = maxCountryTrade[country.engAbb].engAbb + country.engAbb;

              if (trades[country.engAbb + partner.engAbb] > trades[pts]) {
                maxCountryTrade[country.engAbb] = partner;
              }
            }
          }

          for (const abb in maxCountryTrade) {
            let A = mapConfig.countries.find(c => c.engAbb === abb);
            let B = maxCountryTrade[A.engAbb];

            Canvas.drawTrade(A, B, 1);
          }
        }

        generateImage(Canvas.getImage());
      })
    }
  }
}