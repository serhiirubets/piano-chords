import {MinorType} from "../model/SelectedScale";

const HALF_TONE = 1;
const TONE = 2;

export const generateMajorScale = (tonica: number) => {
    // Тон, тон, полутон, тон, тон, тон, полутон
    return [
        tonica,
        tonica + TONE,
        tonica + TONE * 2,
        tonica + TONE * 2 + HALF_TONE,
        tonica + TONE * 3 + HALF_TONE,
        tonica + TONE * 4 + HALF_TONE,
        tonica + TONE * 5 + HALF_TONE,
        tonica + TONE * 5 + HALF_TONE * 2
    ]
}

export const generateMinorScale = (tonica: number) => {
    // Тон, полутон, тон, тон, полутон, тон, тон
    return [
        tonica,
        tonica + TONE,
        tonica + TONE + HALF_TONE,
        tonica + TONE * 2 + HALF_TONE,
        tonica + TONE * 3 + HALF_TONE,
        tonica + TONE * 3 + HALF_TONE * 2,
        tonica + TONE * 4 + HALF_TONE * 2,
        tonica + TONE * 5 + HALF_TONE * 2
    ]
}

export const applyMinorTypeModification = (scaleAbbr:string, scale:number[], minorType:MinorType|undefined) =>{
    const result = [...scale];
    if (scaleAbbr && scaleAbbr.includes('m') && minorType == 'harmonic') {
        result[6] = result[6] + 1;
    }
    if (scaleAbbr && scaleAbbr.includes('m') && minorType == 'melodic') {
        result[6] = result[6] + 1;
        result[5] = result[5] + 1;
    }
    return result
}
