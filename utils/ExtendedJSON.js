/**
 * 
 * @param {string} str 
 * @returns any
 */
export const isJSON = str => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

/**
 * 
 * @param {string} str 
 * @returns boolean
 */
export const isJSONParsable = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

JSON.isJSON = isJSON;
JSON.isJSONParsable = isJSONParsable;

export default {
    ...JSON,
    isJSON,
    isJSONParsable,
};