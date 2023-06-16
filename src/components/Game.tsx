import React, {useEffect, useState} from 'react';
import {intersection} from "lodash";
import Input from "./Input";
import {Data} from "../types/types";
import World from "./World";
import Title from "./Title";
import InfoBar from "./InfoBar";
import {Box} from "@mui/material";
import CountryList from "./CountryList";
import {MAX_GUESSES} from "../constants";


export type Guess = {
    pass: boolean
    name: string
    iso: string
}

type GameProps = {
    start: string
    finish: string
    data: Data,
    shortestPath: string[]
    bannedCountries: string[]

}


const Game = ({start, finish, data, shortestPath, bannedCountries}: GameProps) => {

    const [gameState, setGameState] = useState<number>(0)

    const [selectedCountry, setSelectedCountry] = useState<any>(undefined)
    const [countries, setCountries] = useState<string[]>([])
    const [latLngFocus, setLngLatFocus] = useState<string[]>([])

    const [guesses, setGuesses] = useState<Guess[]>([])
    const [error, setError] = useState<string | undefined>()
    const [showShortestPath, setShowShortestPath] = useState<boolean>(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCountries(countries => [...countries, start])
            setLngLatFocus([data.countries[start].position[0], data.countries[start].position[1]])
            addGuess(data.countries[start].iso, data.countries[start].long_name, true)
        }, 100);
        return () => clearTimeout(timer);
    }, [data, setCountries, setLngLatFocus, start]);

    useEffect(() => {
        if (error === undefined) return
        const timer = setTimeout(() => {
            setError(undefined)
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        const guessesleft = MAX_GUESSES - guesses.filter(g => !g.pass).length
        if (guessesleft < 1) setGameState(2)
    }, [guesses, setGameState]);

    const addGuess = (iso: string, name: string, pass: boolean) => {
        setGuesses(guesses => [...guesses, {iso: iso, name: name, pass: pass}])
    }

    const isBorderCountry = () => {
        return countries.length === 0 || intersection(countries, data.countries[selectedCountry.iso].borders).length > 0
    }

    const submit = () => {
        setSelectedCountry(undefined)
        if (bannedCountries.includes(selectedCountry.iso)) {
            setError(`You cannot travel to ${selectedCountry.long_name}`)
            return
        }
        if (isBorderCountry()) {
            setCountries(countries => [...countries, selectedCountry.iso])
            addGuess(selectedCountry.iso, selectedCountry.long_name, true)
            setLngLatFocus([selectedCountry.position[0], selectedCountry.position[1]])
            if (selectedCountry.iso === finish) setGameState(1)
        } else {
            setError(`${selectedCountry.long_name} is not a bordering country`)
            if (guesses.filter(g => g.iso === selectedCountry.iso).length === 0) {
                addGuess(selectedCountry.iso, selectedCountry.long_name, false)
            }
        }
    }

    return (
        <Box sx={{
            display: "block",
            position: "relative",
            height: "inherit",
            width: "inherit"
        }}>
            <Box sx={{
                display: "block",
                width: "80%",
                paddingLeft: "10%",
                paddingRight: "10%",
                paddingTop: "24px",
                height: "115px",
            }}>
                <Input
                    gameState={gameState}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countries={Object.values(data.countries)}
                    submit={submit}
                    showShortestPath={showShortestPath}
                    setShowShortestPath={setShowShortestPath}
                    lives={guesses.filter(g => !g.pass).length}
                />

            </Box>
            <Box sx={{display: "block", position: "relative", height: "50%", width: "inherit", zIndex: 10}}>
                <Box id="border" sx={{
                    width: "calc(100% - 24px)",
                    height: "calc(100% - 24px)",
                    border: "solid white 24px",
                    zIndex: "100",
                    cursor: "none",
                    pointerEvents: "none",
                    marginLeft: "-12px",
                    marginTop: "-12px",
                    overflowY: "hidden",
                    position: "absolute"
                }}>
                </Box>
                <Box sx={{width: "100%", height: "100%", pointerEvents: "auto", position: "absolute"}}>
                    <World
                        showShortestPath={showShortestPath}
                        shortestPath={shortestPath}
                        data={data}
                        countries={countries}
                        bannedCountries={bannedCountries}
                        lngLat={latLngFocus}/>
                </Box>

            </Box>
            <Box sx={{
                display: "block",
                zIndex: 100,
                textAlign: "left",
                paddingLeft: "10%",
                paddingRight: "10%",
                width: "80%",
                height: "calc(50% - 115px)",
                overflowY: "scroll"
            }}>
                <InfoBar gameState={gameState} error={error}/>
                <Title
                    start={data.countries[start].long_name}
                    finish={data.countries[finish].long_name}
                    bannedCountries={bannedCountries.map(b => data.countries[b].long_name)}/>
                {!showShortestPath ?
                    <CountryList countries={guesses}/> :
                    <CountryList countries={shortestPath.map(c => {
                        return {"name": data.countries[c].long_name, "iso": data.countries[c].iso}
                    })}/>
                }
            </Box>
        </Box>
    );
}

export default Game;
