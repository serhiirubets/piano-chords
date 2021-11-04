import {useEffect, useState} from "react";
import Soundfont, {Player} from "soundfont-player";
import {SOUNDFONT_FONT, SOUNDFONT_FORMAT} from "../../schemeEditor/model/global-constants";

export const SoundfontProvider = ({
                                      instrumentName,
                                      hostname,
                                      audioContext,
                                      render
                                  }) => {

    const [activeAudioNodes, setActiveAudioNodes] = useState<Object>({})
    const [instruments, setInstruments] = useState<Player | null>(null)

    useEffect(() => {
        loadInstrument(instrumentName, SOUNDFONT_FORMAT, SOUNDFONT_FONT)
    },[instrumentName])


    const loadInstrument = async (instrumentName, format, font) => {
        // Re-trigger loading state
        console.log("loading instrument", instrumentName, format, font)
        const instrument = await Soundfont.instrument(audioContext, instrumentName, {
            format: format,
            soundfont: font,
            nameToUrl: (name, soundfont, format) => {
                return `${hostname}/${soundfont}/${name}-${format}.js`;
            },
        })
        setInstruments(instrument)
    };

    const playNote = (midiNumber, timestampOffset = 0, options: { duration?: number, gain?: number }, instrumentName?) => {
        console.log('Instruments during playback time', instruments)

        audioContext.resume().then(() => {

            if (!instruments) {
                console.log('no instruments found')
                return
            }
            const audioNode = instruments.play(midiNumber, audioContext.currentTime + timestampOffset, options);
            setActiveAudioNodes({
                activeAudioNodes: Object.assign({}, activeAudioNodes, {
                    [midiNumber]: audioNode,
                }),
            })
        });
    };

    const stopNote = (midiNumber) => {
        audioContext.resume().then(() => {
            if (!activeAudioNodes[midiNumber]) {
                return;
            }
            const audioNode = activeAudioNodes[midiNumber];
            audioNode.stop();
            setActiveAudioNodes({
                activeAudioNodes: Object.assign({}, activeAudioNodes, {
                    [midiNumber]: null,
                }),
            });
        });
    };

    // Clear any residual notes that don't get called with stopNote
    const stopAllNotes = () => {
        instruments && instruments.stop();

        audioContext.resume().then(() => {
            const runningAudioNodes = Object.values(activeAudioNodes);
            console.log(runningAudioNodes)
            runningAudioNodes
                .flatMap(node => Object.values(node))
                .forEach((node: any) => {
                    if (node) {
                        console.log(node)

                        node.stop();
                    }
                });
            setActiveAudioNodes({})

        });
    };

    return render({
        isLoading: !instruments,
        playNote: playNote,
        stopNote: stopNote,
        stopAllNotes: stopAllNotes,
    });
}
