export type Country = {
    long_name: string
    iso: string
    geometry: {
        "type": string,
        "coordinates": any[]
    }
    position: string[],
    borders: string[]
}
