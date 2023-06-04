import React, {useEffect, useState} from 'react';
import './App.css';
import {intersection} from "lodash";
import Input from "./Input";
import {Country} from "./Country";
import World from "./World";
import Title from "./Title";
import Guesses from "./Guesses";
import InfoBar from "./InfoBar";
import {Box} from "@mui/material";


export type Guess = {
    pass: boolean
    name: string
    iso: string
}

type GameProps = {
    start: string
    finish: string
    data: Record<string, Country>,
    shortestPath: string[]

}


const Game = ({start, finish, data, shortestPath}: GameProps) => {

    const MAX_GUESSES = 3

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
            setLngLatFocus([data[start].position[0], data[start].position[1]])
            addGuess(data[start].iso, data[start].long_name, true)
        }, 100);
        return () => clearTimeout(timer);
    }, [data, setCountries, setLngLatFocus, start]);

    useEffect(() => {
        if (error === undefined) return
        const timer = setTimeout(() => {
            setError(undefined)
        }, 1000);
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
        return countries.length === 0 || intersection(countries, data[selectedCountry.iso].borders).length > 0
    }

    const submit = () => {
        setSelectedCountry(undefined)
        if (isBorderCountry()) {
            setCountries(countries => [...countries, selectedCountry.iso])
            addGuess(selectedCountry.iso, selectedCountry.long_name, true)
            setLngLatFocus([selectedCountry.position[0], selectedCountry.position[1]])
            console.log(selectedCountry)
            console.log(finish)
            if (selectedCountry.iso === finish) setGameState(1)
        } else {
            setError(selectedCountry.long_name)
            if (guesses.filter(g => g.iso === selectedCountry.iso).length === 0) {
                addGuess(selectedCountry.iso, selectedCountry.long_name, false)
            }
        }
    }

    return (
        <div className="App" style={{height: "100%"}}>
            <Box sx={{
                position: "absolute",
                width: "90%",
                zIndex: 100,
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                top: 30,
            }}>
                <Input
                    disabled={gameState !== 0}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countries={Object.values(data)}
                    submit={submit}
                />
            </Box>
            <Box sx={{position: "absolute", paddingTop: "59px"}}>
                <World
                    showShortestPath={showShortestPath}
                    shortestPath={shortestPath}
                    data={Object.values(data)}
                    countries={countries}
                    lngLat={latLngFocus}/>
            </Box>
            <Box sx={{position: "absolute", zIndex: 100, paddingLeft: "100px", paddingTop: "150px", textAlign: "left"}}>
                <Title start={data[start].long_name} finish={data[finish].long_name}/>
                <InfoBar gameState={gameState} error={error}/>
                <Guesses guesses={guesses}/>
            </Box>

        </div>
    );
}

export default Game;
