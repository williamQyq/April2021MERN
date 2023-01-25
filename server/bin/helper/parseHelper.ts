import { ParserRecord } from "#root/lib/models/interface";

/**
 * 
 * @param records 
 * sample: [
 * ["upc","name","price"],
 * ["192093","NAME","$5.00"],
 * ...
 * ]
 * @returns 
 * sample:[
 *  {
 *      upc:"192093",
 *      name:"NAME",
 *      price:5
 * },
 * ...
 * ]
 */
export function parseCsvHelper<O = unknown>(records: string[][]): O[] | undefined {
    //no records data needs to be parsed.
    if (records.length <= 1) {
        return;
    };

    //array of Type O object
    let parsedResult = records.slice(1).reduce<any[]>((prev, cur) => {
        let obj: ParserRecord = {};
        for (const [index, key] of records[0].entries()) {
            if (key === "price") {
                obj[key] = currencyStringConverter(cur[index]);
            } else {
                obj[key] = cur[index];
            }
        }
        return [...prev, obj];
    }, []);

    return parsedResult;
}

export function currencyStringConverter(currency: string) {
    return Number(currency.replace(/[^0-9.-]+/g, ""));
}