export const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

export const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export const  deepCopy = <T> (object:T) => {
    return JSON.parse(JSON.stringify(object)) as T
}

export const deepCopyMap = <K,V>(object:Map<K,V>) => {
    return new Map(deepCopy(Array.from(object.entries()))) as Map<K, V>
}
