import appConfig from "../config/app.config.json";
import fs from 'fs';


export function generateImage (imgTemplate: string) {
  const path = appConfig.outputFolder + appConfig.outputFilename; 

  fs.writeFile(path, imgTemplate, (err) => {
    if (err) {
        console.error('Error writing HTML file:', err);
        return;
    }
    console.log(`HTML file '${path}' generated successfully`);
    console.log(`Open '${path}' in a browser to view the content`);
});
}