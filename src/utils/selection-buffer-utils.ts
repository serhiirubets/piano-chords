import {SelectionIndex} from "../model/selection/selection-index";
import {HandType, TripletData} from "../model/skeleton-entities-data/skeleton-data";
import {getTripletByIndex} from "./triplet-utils";

export const prepareFootprintFromIndices = (indicesArray: SelectionIndex[], triplets?: TripletData[]) => {
    let {
        leftHandSelection,
        rightHandSelection,
        maxLength,
        maxLengthMinIndex
    } = getIndicesLengthAndMinPosition(indicesArray, triplets);

    let rightArmFootprint = '';
    let leftArmFootprint = '';
    for (let i = 0; i <= maxLength; i++) {
        rightArmFootprint += rightHandSelection.includes(maxLengthMinIndex + i) || isIndexInsideTriplet(maxLengthMinIndex + i, HandType.RIGHT, triplets) ? "1" : "0";
        leftArmFootprint += leftHandSelection.includes(maxLengthMinIndex + i) || isIndexInsideTriplet(maxLengthMinIndex + i, HandType.LEFT, triplets) ? "1" : "0";
    }
    return rightArmFootprint + "\n" + leftArmFootprint
}

const isIndexInsideTriplet = (index: number, hand: HandType, triplets?: TripletData[]) => {
    if (!triplets) {
        return false
    }
    return getTripletByIndex(triplets,{noteHand:hand, index:index})
}


export const getIndicesLengthAndMinPosition = (indicesArray: SelectionIndex[], triplets?: TripletData[]) => {
    const leftHandSelection = indicesArray.filter(idx => idx.noteHand === HandType.LEFT).map(idx => idx.index)
    const leftHandTripletSelection = triplets ? triplets.filter(triplet => triplet.hand === HandType.LEFT).map(t => t.start + t.length-1) : []
    const rightHandSelection = indicesArray.filter(idx => idx.noteHand === HandType.RIGHT).map(idx => idx.index)
    const rightHandTripletSelection = triplets ? triplets.filter(triplet => triplet.hand === HandType.RIGHT).map(t => t.start + t.length-1) : []

    const [minLeft, maxLeft] = [Math.min(...leftHandSelection), Math.max(...leftHandSelection, ...leftHandTripletSelection)]
    const [minRight, maxRight] = [Math.min(...rightHandSelection), Math.max(...rightHandSelection, ...rightHandTripletSelection)]

    let maxLength: number;
    let maxLengthMinIndex: number;

    if (maxRight - minRight > maxLeft - minLeft) {
        maxLength = maxRight - minRight;
        maxLengthMinIndex = minRight;
    } else {
        maxLength = maxLeft - minLeft;
        maxLengthMinIndex = minLeft;
    }
    return {leftHandSelection, rightHandSelection, maxLength, maxLengthMinIndex};
}

export const getPositionRelativeToSelectionStart = (index: SelectionIndex, allIndices: SelectionIndex[]) => {
    const minPosition = getIndicesLengthAndMinPosition(allIndices).maxLengthMinIndex;
    return index.index - minPosition
}
