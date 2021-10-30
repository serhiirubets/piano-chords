
export interface OctaveNotation {
    name: string
    entries: string[],
    regexpKeys: string,
    regexp: RegExp
}

export const Octaves = {
    SCIENTIFIC: {
        name: "Научная",
        entries: ["0", "1", "2", "3", "4", "5", "6", "7"],
        defaultOctaveLeft: "3",
        defaultOctaveRight: "4",
        regexpKeys: "0-9",
        regexp: RegExp(/[0-9]{1}/g)
    },
    NAME: {
        name: "Именная",
        entries: [".sk", ".k", ".b", ".m", ".1", ".2", ".3", ".4"],
        defaultOctaveLeft: ".m",
        defaultOctaveRight: ".1",
        regexpKeys: "\.skbm1-5",
        regexp: RegExp(/(\.sk|\.k|\.b|\.m|\.1|\.2|\.3|\.4|\.5)/g),
    },
    MIDI: {
        name: "MIDI",
        entries: ["-4", "-3", "-2", "-1", "0", "1", "2","3", "4"],
        defaultOctaveLeft: "-1",
        defaultOctaveRight: "0",
        regexpKeys:"\\-0-4",
        regexp: RegExp(/(-4)|(-3)|(-2)|(-1)|(0)|(1)|(2)|(3)|(4)/g)
    }
}

export const parseOctaveNotationToScientific = (value: string, notation: OctaveNotation) => {
    if (notation.name === Octaves.SCIENTIFIC.name) {
        return Number(value)
    }
    const octaveIndex = notation.entries.indexOf(value);
    return Number(Octaves.SCIENTIFIC.entries[octaveIndex])
}

export const getOctaveNotationFromScientific = (scientificValue: number, notation: OctaveNotation) => {
    if (notation.name === Octaves.SCIENTIFIC.name) {
        return scientificValue.toString()
    }
    const octaveIndex = Octaves.SCIENTIFIC.entries.indexOf(scientificValue.toString());

    return notation.entries[octaveIndex].toString()
}

