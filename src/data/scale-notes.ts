import {MinorType} from "../model/SelectedScale";

export const majorSharp = ['G', 'D', 'A', 'E', 'B', 'F#', 'C#']
export const majorFlat = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']

export const minorSharp = ['Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m']
export const minorFlat = ['Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm']

export const defaultScale = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

export const allScales = ['C', 'Am', ...majorSharp, ...majorFlat, ...minorSharp, ...minorFlat];
// export const allScales = ['C', 'Am'];


export const noteMidiKeyOverrides = new Map<string, string>()
    .set('Cb', 'B')
    .set('E#', 'F')

export const minorTypesNameMapping = new Map<MinorType, string>()
    .set('natural', 'Натуральный')
    .set('harmonic', 'Гармонический')
    .set('melodic', 'Мелодический')

/**
 * Returns positive if 1st note is higher than second, -1 else
 */
export const compareNotes = (first, second)=> {
    console.log(`index of ${first} is ${defaultScale.indexOf(first)}, index of ${second} is ${defaultScale.indexOf(second)}`)
    return defaultScale.indexOf(first) - defaultScale.indexOf(second);
}
