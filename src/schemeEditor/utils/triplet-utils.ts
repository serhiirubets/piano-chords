import {TripletHandlingProps} from "../components/editor/skeleton";
import {PlaybackDuration} from "../model/note-data";
import {TripletData} from "../model/deprecated/skeleton-data";

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

export const isPartOfTriplet = (triplets: TripletData[], index: number) => {
    return getTripletByIndex(triplets, index) !== null
}

export const getTripletByIndex = (triplets: TripletData[], idx: number): TripletData | null => {

    const maybeTriplet = triplets
        .filter(triplet => triplet.start <= idx && idx < triplet.start + triplet.length);
    return maybeTriplet.length > 0 ?
        maybeTriplet[0] :
        null;
}

export const getTripletDurationByIndex = (triplets: TripletData[], index: number) => {
    const maybeTriplet = getTripletByIndex(triplets, index);

    if (maybeTriplet) {
        return maybeTriplet.length;
    }
}
