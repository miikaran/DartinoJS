const getParsedValueByKey = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const putParsedValueToStorage = (key, value) => {
    return localStorage.setItem(
        key, 
        JSON.stringify(value)
    )
}

const removeItem = (key) => {
    localStorage.removeItem(key)
}

export {
    getParsedValueByKey,
    putParsedValueToStorage,
    removeItem
}