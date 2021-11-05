import {SelectionIndex} from "./selection-index";
import {SkeletonNodeData} from "../skeleton-entities-data/skeleton-node-data";
import {TripletData} from "../skeleton-entities-data/skeleton-data";
import {deepCopy} from "../../utils/js-utils";
import {getIndicesLengthAndMinPosition, prepareFootprintFromIndices} from "../../utils/selection-buffer-utils";

export class SelectionBuffer {
    private storage = new Map<SelectionIndex, SkeletonNodeData>()
    private tripletStorage = new Map<SelectionIndex, TripletData>()

    put = (key: SelectionIndex, value: SkeletonNodeData) => {
        this.storage.set(key, value)
    }

    putTriplet = (key: SelectionIndex, value: TripletData) => {
        this.tripletStorage.set(key, value)
    }

    get = (key: SelectionIndex) => {
        const presentKey = Array.from(this.storage.keys()).filter(k => k.index === key.index && k.noteHand === key.noteHand)[0];
        return this.storage.get(presentKey)
    }

    getTriplet = (key: SelectionIndex) => {
        const presentKey = Array.from(this.storage.keys()).filter(k => k.index === key.index && k.noteHand === key.noteHand)[0];
        return this.tripletStorage.get(presentKey)
    }

    getAllKeys = () => {
        return Array.from(this.storage.keys())
    }

    getByRelativePositionAndOffset = (relativePosition: number, selectionIndex: SelectionIndex) => {
        const leftMostBufferEntryIndex = getIndicesLengthAndMinPosition(this.getAllKeys()).maxLengthMinIndex
        const transformedIndex = {noteHand: selectionIndex.noteHand, index: relativePosition + leftMostBufferEntryIndex}
        const originalData = this.get(transformedIndex);
        if(originalData){
            return deepCopy(originalData)
        }
        return undefined
    }


    getTripletByPositionAndIndex = (relativePosition: number, selectionIndex: SelectionIndex) => {
        const leftMostBufferEntryIndex = getIndicesLengthAndMinPosition(this.getAllKeys()).maxLengthMinIndex
        const transformedIndex = {noteHand: selectionIndex.noteHand, index: relativePosition + leftMostBufferEntryIndex}
        const originalTriplet =  this.getTriplet(transformedIndex)
        if(originalTriplet){
            const updatedTriplet = deepCopy(originalTriplet)
            updatedTriplet.start = selectionIndex.index
            return  updatedTriplet
        }
        return undefined
    }


    isEmpty = () => {
        return this.storage.size === 0 && this.tripletStorage.size === 0
    }

    clear = () => {
        this.storage = new Map<SelectionIndex, SkeletonNodeData>()
        this.tripletStorage = new Map<SelectionIndex, TripletData>()
    }

    isMultilineBuffer = () => {
        const entriesArray = Array.from(this.storage.entries())
        return entriesArray
            .some(([key, value]) => key.noteHand !== entriesArray[0][0].noteHand)
    }

    doesBufferMatchSelection = (selectionIndices: SelectionIndex[]) => {
        const bufferFootprint = prepareFootprintFromIndices(this.getAllKeys(), Array.from(this.tripletStorage.values()))
        const selectionFootprint = prepareFootprintFromIndices(selectionIndices)
        return bufferFootprint === selectionFootprint
    }

    getMaximumBufferLength = () => {
        return getIndicesLengthAndMinPosition(this.getAllKeys()).maxLength
    }


}
