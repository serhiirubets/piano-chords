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

export const deepCopy = (object:Object) => {
    return JSON.parse(JSON.stringify(object))
}
