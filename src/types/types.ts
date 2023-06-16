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


export type Path = {
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    color: string
}

export type Data = {
    "countries": Record<string, Country>,
    "paths": Path[]
}

export type GameT = {
    to: string
    from: string
    without: string[]
}