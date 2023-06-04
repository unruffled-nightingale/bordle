import Globe from "react-globe.gl";
import React, {useEffect, useRef} from "react";
import {Country} from "./Country";

type WorldProps = {
    showShortestPath: boolean
    shortestPath: string[]
    data: Country[]
    countries: string[]
    lngLat: string[]
}

const World = ({data, countries, shortestPath, showShortestPath, lngLat}: WorldProps) => {

    const globeEl = useRef()
    const NOT_FOUND_COLOR = 'rgba(250, 250, 250, 1)'
    const FOUND_CAP_COLOR = 'rgba(69, 198, 71, 1)'
    const FOUND_SIDE_COLOR = 'rgba(153, 228, 154, 1)'
    const SHORTEST_PATH_CAP_COLOR = 'rgba(250, 250, 0, 1)'
    const SHORTEST_PATH_SIDE_COLOR = 'rgba(140, 4, 140, 1)'

    useEffect(() => {
        // @ts-ignore
        globeEl.current.pointOfView({lat: lngLat[0], lng: lngLat[1]}, [2000])
    }, [lngLat])

    const getCapColor = (e: any) => {
        if (showShortestPath && shortestPath.includes(e.iso)) return SHORTEST_PATH_CAP_COLOR
        if (countries.includes(e.iso)) return FOUND_CAP_COLOR
        return NOT_FOUND_COLOR
    }

    const getSideColor = (e: any): string => {
        if (showShortestPath && shortestPath.includes(e.iso)) return SHORTEST_PATH_SIDE_COLOR
        if (countries.includes(e.iso)) return FOUND_SIDE_COLOR
        return NOT_FOUND_COLOR
    }

    const getAltitude = (e: any) => {
        if (showShortestPath && shortestPath.includes(e.iso)) return 0.05
        if (countries.includes(e.iso)) return 0.03
        return 0.01
    }

    return <Globe
        // height={1000}
        showAtmosphere={false}
        ref={globeEl}
        backgroundColor={"white"}
        polygonsData={data}
        polygonAltitude={getAltitude}
        polygonCapColor={getCapColor}
        polygonSideColor={getSideColor}
        polygonStrokeColor={"black"}
        polygonsTransitionDuration={2000}
    />
}

export default World