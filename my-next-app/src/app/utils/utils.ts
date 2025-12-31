/**
 * Takes a string that may be undefined, splices the string adds ellipses if 
 * the length of the string reaches the limit.
 * 
 * @param inputStr - The input string for processing
 * @param limit - The limit of characters before adding ellipsis
 * @returns - a string string with ellpisis if limit is reached, otherwise no modifcations
 */

export function TrucateText(inputStr: string | undefined, limit: number): string {
    if (inputStr !== undefined && inputStr.length >= limit) {
        return `${inputStr.slice(0,limit)}...`
    } else if (inputStr !== undefined) {
        return inputStr 
    } else 
        return ""
}