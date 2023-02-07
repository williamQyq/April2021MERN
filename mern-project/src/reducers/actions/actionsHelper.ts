/**
 * 
 * @param accessories e.g. "8GB_{index}"
 * @description parse and remove tailing string after underscore
 * @returns "8GB" | null //if no match
 */
export function parseMyAccessoryDataSource(accessory: string): string {
    const matchReg = /.*_\d*/;
    let replaceReg = /_\d*/;

    if (!accessory.match(matchReg)) {
        return accessory;
    }

    return accessory.replace(replaceReg, "");
}

export function parseMyMultiAccessoriesDataSource(accessories: string[]): string[] {
    return accessories.map(accs =>
        parseMyAccessoryDataSource(accs)
    );
}

/**
 * 
 * @param accessories e.g. "8GB_{index}"
 * @description parse and get value of {value}GB_.*
 * @returns 8 | 0 //if no found
 */
export function parseRamDataSource(unparsedRam: string): number {
    const ramValueMatchReg = /(?<value>\d+)GB/;
    const found = unparsedRam.match(ramValueMatchReg)
    if (!found)
        return 0;

    return Number(found.groups!.value!);
}