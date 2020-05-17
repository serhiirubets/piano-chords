import {MinorType, SelectedScale} from "../model/SelectedScale";

export const majorSharp = ['G', 'D', 'A', 'E', 'B', 'F#', 'C#']
export const majorFlat = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']

export const minorSharp = ['Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m']
export const minorFlat = ['Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm']

export const allScales = ['C', 'Am', ...majorSharp, ...majorFlat, ...minorSharp, ...minorFlat];
// export const allScales = ['C', 'Am'];


export const noteMidiKeyOverrides = new Map<string, string>()
    .set('Cb', 'B')
    .set('E#', 'F')

export const minorTypesNameMapping = new Map<MinorType, string>()
    .set('natural', 'Натуральный')
    .set('harmonic', 'Гармонический')
    .set('melodic', 'Мелодический')
