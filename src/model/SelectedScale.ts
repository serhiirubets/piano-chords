// export interface SelectedScale {
//     tonic:string,
//     type: 'major'|'minor';
// }

export type SelectedScale = [string, 'major'|'minor']
export type MinorType='natural'|'harmonic'|'melodic';
export type TestType='playNotes|nameScale|listenAndName';
