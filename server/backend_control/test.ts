import { PdfGenerator, IPickUp } from "../bin/pdfGenerator/pdfGenerator.js";
const pdfGenerator = new PdfGenerator();

const data: IPickUp = [
    {
        upc: "1",
        location: "1A-1",
        qty: 2
    }
]
await pdfGenerator.generatePickUpPDF(data);
