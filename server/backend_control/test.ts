import moment from "moment";
import { PdfGenerator, IPickUp } from "../bin/pdfGenerator/pdfGenerator.js";

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
