import {NoteHand, SkeletonData} from "../model/skeleton-data";

export const getNotesToPlay = (quadrats: Array<SkeletonData>) => {
    const notes = new Array<number[]>();
    console.log(quadrats.length)
    quadrats.forEach(quadrat => {
        console.log('QUadrat size',quadrat.size )
        for (let i = 0; i < quadrat.size; i++) {
            const currentBeatNotes = [...quadrat.getNode(NoteHand.LEFT, i).getAllMidiNumbers(),
                ...quadrat.getNode(NoteHand.RIGHT, i).getAllMidiNumbers()];
            console.log('Quadrat '+quadrat.id+' note at '+i,currentBeatNotes )
            console.log('index ', i, 'notes', currentBeatNotes);
            notes.push(currentBeatNotes);
        }
    })
    return notes;
}

export const playNotes = (notesToPlay, playFunction, noteDuration) => {
    let i = 1;
    console.log('Notes to Play', notesToPlay)
    notesToPlay.forEach(noteOrChord => {
        const midiNumbers = [...noteOrChord];
        midiNumbers.forEach(midiNumber =>
            setTimeout(() => {
                console.log('playing', notesToPlay)
                playFunction(midiNumber)
            }, i * noteDuration * 1000)
        )
        i++
    })

}
