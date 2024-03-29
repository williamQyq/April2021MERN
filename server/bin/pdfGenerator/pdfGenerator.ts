import puppeteer, { Browser, Page, PDFOptions } from "puppeteer";
import hbs from "handlebars";
import fs, { PathLike } from 'fs-extra';
import path from "path";

type HTMLString = string;
const pdfGeneratorDirPath = './bin/pdfGenerator'

export interface IPickUpTask {
    upc: string,
    qty: number,
    location: string,
    backUpLocs?: Array<string | undefined>
}

export interface IPickUp {
    origTasks: IPickUpTask[],
    upgradeTasks: IPickUpTask[];
    processedTrackings: string[];
    date: string
}
export class PdfGenerator {

    constructor() { }

    async _compile(templateName: string, data: IPickUp): Promise<HTMLString> {
        const filePath = path.join(pdfGeneratorDirPath, "templates", `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf8');
        return hbs.compile(html)(data);
    }

    async generatePickUpPDF(fileName: string, data: IPickUp): Promise<PathLike | undefined> {
        const pdfSavedPath: PathLike = path.join(pdfGeneratorDirPath, '/pdf/', fileName);
        try {
            const browser: Browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page: Page = await browser.newPage();
            const content: HTMLString = await this._compile('pickup', data);

            await page.setContent(content);
            const option: PDFOptions = {
                path: pdfSavedPath,
                format: 'a4',
                printBackground: true,
            }
            await page.pdf(option);
            console.log(`Done creating pickup pdf.\n**${fileName}**`);

            await browser.close();
            // process.exit();
            return pdfSavedPath;
        } catch (e: unknown) {
            console.error(e);
            throw new Error("generatePickUpPDF Failed.");
        }
    }
}