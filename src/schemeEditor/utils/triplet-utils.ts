import {TripletHandlingProps} from "../components/editor/skeleton";
import {PlaybackDuration} from "../model/note-data";
import {HandType, TripletData} from "../model/deprecated/skeleton-data";
import {SelectionIndex} from "../model/selection/selection-index";

export const getTripletEffectiveParameters = (tripletProps: TripletHandlingProps) => {
    const is8thTriplet = tripletProps.tripletDuration / 3 >= 1;
    const idealDuration = is8thTriplet ? PlaybackDuration.FULL : 0.6;
    const lastNodeOffset = is8thTriplet ? PlaybackDuration.FULL * 3 : PlaybackDuration.FULL;
    const standardOffsets = [0, tripletProps.tripletDuration / 2 - idealDuration / 2, lastNodeOffset]

    return {
        is8thTriplet: is8thTriplet,
        idealDuration: idealDuration,
        standardOffsets: standardOffsets,
    }
}

export const isPartOfTriplet = (triplets: TripletData[], index: SelectionIndex) => {
    return getTripletByIndex(triplets, index) !== null
}

export const getTripletByIndex = (triplets: TripletData[], idx: SelectionIndex, ): TripletData | null => {

    const maybeTriplet = triplets
        .filter(triplet=> triplet.hand === idx.noteHand)
        .filter(triplet => triplet.start <= idx.index && idx.index < triplet.start + triplet.length);
    return maybeTriplet.length > 0 ?
        maybeTriplet[0] :
        null;
}

export const getTripletDurationByIndex = (triplets: TripletData[], index: SelectionIndex) => {
    const maybeTriplet = getTripletByIndex(triplets, index);

    if (maybeTriplet) {
        return maybeTriplet.length;
    }
}
