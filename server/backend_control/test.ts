import moment from "moment";
import { PdfGenerator, IPickUp } from "#rootTS/bin/pdfGenerator/pdfGenerator.js";
// import { PdfGenerator, IPickUp } from "#binTS/pdfGenerator/pdfGenerator.js";

export default async function test(): Promise<void> {
    const pdfGenerator = new PdfGenerator();

    const data: IPickUp = {
        tasks: [
            {
                upc: "123456789",
                location: "1A-1",
                qty: 2
            }
        ],
        date: moment().format()
    }
    await pdfGenerator.generatePickUpPDF(data);

}
