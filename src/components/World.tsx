import Globe from "react-globe.gl";
import React, {memo, useEffect, useRef} from "react";
import {Data} from "../types/types";
import {ASPECT_RATIO} from "../constants";

type WorldProps = {
    showShortestPath: boolean
    shortestPath: string[]
    bannedCountries: string[]
    data: Data
    countries: string[]
    lngLat: string[]
}

const World = ({data, countries, shortestPath, showShortestPath, lngLat, bannedCountries}: WorldProps) => {

    const globeEl = useRef()
    const NOT_FOUND_COLOR = 'rgba(250, 250, 250, 1)'
    const FOUND_CAP_COLOR = 'rgba(69, 198, 71, 1)'
    const FOUND_SIDE_COLOR = 'rgba(153, 228, 154, 1)'
    const SHORTEST_PATH_CAP_COLOR = 'rgba(255, 204, 0, 1)'
    const SHORTEST_PATH_SIDE_COLOR = 'rgba(255, 153, 51, 1)'
    const BANNED_COUNTRY_SIDE_COLOR = 'rgba(255, 153, 153, 1)'
    const BANNED_COUNTRY_CAP_COLOR = 'rgba(255, 0, 0, 1)'

    useEffect(() => {
        // @ts-ignore
        globeEl.current.pointOfView({lat: lngLat[0], lng: lngLat[1]}, [2000])
    }, [lngLat])

    const getCapColor = (e: any) => {
        if (bannedCountries.includes(e.iso)) return BANNED_COUNTRY_CAP_COLOR
        if (showShortestPath && shortestPath.includes(e.iso)) return SHORTEST_PATH_CAP_COLOR
        if (!showShortestPath && countries.includes(e.iso)) return FOUND_CAP_COLOR
        return NOT_FOUND_COLOR
    }

    const getSideColor = (e: any): string => {
        if (bannedCountries.includes(e.iso)) return BANNED_COUNTRY_SIDE_COLOR
        if (showShortestPath && shortestPath.includes(e.iso)) return SHORTEST_PATH_SIDE_COLOR
        if (!showShortestPath && countries.includes(e.iso)) return FOUND_SIDE_COLOR
        return NOT_FOUND_COLOR
    }

    const getAltitude = (e: any) => {
        if (showShortestPath && shortestPath.includes(e.iso)) return 0.03
        if (countries.includes(e.iso)) return 0.03
        if (bannedCountries.includes(e.iso)) return 0.03
        return 0.01
    }

    const getOnGlobeClick = (a: any, b: any, c: any) => {
        console.log(a.long_name + ": {'lat': " + c.lat + ", 'lng': " + c.lng + "}")
    }

    return <Globe
        height={window.innerHeight / ASPECT_RATIO}
        width={window.innerHeight / ASPECT_RATIO}
        showAtmosphere={false}
        ref={globeEl}
        backgroundColor={"white"}
        polygonsData={Object.values(data.countries)}
        polygonAltitude={getAltitude}
        polygonCapColor={getCapColor}
        polygonSideColor={getSideColor}
        polygonStrokeColor={"black"}
        polygonsTransitionDuration={2000}
        arcsData={data.paths}
        arcColor={"color"}
        arcAltitude={0}
        arcStroke={0.5}
        onPolygonClick={getOnGlobeClick}

    />
}

export default memo(World)