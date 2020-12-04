import {NoteHand, SkeletonData} from "../model/skeleton-data";
import {PlaybackData} from "../model/skeleton-node-data";


export const getNotesToPlay = (quadrats: Array<SkeletonData>) => {
    const notes = new Array<PlaybackData[][]>();
    console.log(quadrats.length)
    quadrats.forEach(quadrat => {
        for (let i = 0; i < quadrat.size; i++) {
            const currentBeatNotes = [...quadrat.getNode(NoteHand.LEFT, i).getPlaybackData(),
                ...quadrat.getNode(NoteHand.RIGHT, i).getPlaybackData()]
                .flat(3);
            notes.push(currentBeatNotes);
            console.log(currentBeatNotes)
        }
    })
    return notes;
}

export const playNotes = (beatsToPlay, playFunction, tempo) => {
    console.log('Notes to Play', beatsToPlay)
    const STANDARD_DURATION = tempo * 1;

    for (let i = 0; i <= beatsToPlay.length; i++) {
        const currentBeat: PlaybackData[] = beatsToPlay[i];
        if(currentBeat === undefined){
            continue;
        }
        console.log('beat',currentBeat)
        currentBeat.forEach(playback => {
            const offset = STANDARD_DURATION * (i+1 + playback.playbackOffset);
            playFunction(playback.midiNumber, playback.duration, offset);
        })
    }
}

