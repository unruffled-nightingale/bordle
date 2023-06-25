import React, {useCallback, useEffect, useState} from 'react';
import {intersection} from "lodash";
import Input from "./Input";
import {Data, GameT} from "../types/types";
import World from "./World";
import Title from "./Title";
import InfoBar from "./InfoBar";
import {Box} from "@mui/material";
import CountryList from "./CountryList";
import {MAX_GUESSES} from "../constants";
import Graph from "node-dijkstra";
import {useLocalStorage} from "../hooks/getLocalState";


export type Guess = {
    pass: boolean
    name: string
    iso: string
}

type GameProps = {
    data: Data,
    games: GameT[]
}


const Game = ({games, data}: GameProps) => {

    const [gameLoaded, setGameLoaded] = useState<boolean>(false)
    const [gameIndex, setGameIndex] = useState<number>(0)

    const [shortestPath, setShortestPath] = useState<string[]>([])
    const [start, setStart] = useState<string>("")
    const [finish, setFinish] = useState<string>("")
    const [bannedCountries, setBannedCountries] = useState<string[]>([])

    const [gameState, setGameState] = useState<number>(0)

    const [selectedCountry, setSelectedCountry] = useState<any>(undefined)
    const [latLngFocus, setLngLatFocus] = useState<string[]>([])

    const yyyymmdd = new Date().toISOString().split('T')[0]
    const [guessesWithGameIndex, setGuessesWithGameIndex] = useLocalStorage(`bordle${yyyymmdd}`, {})
    const [error, setError] = useState<string | undefined>()
    const [showShortestPath, setShowShortestPath] = useState<boolean>(false)

    const bordersWithWeights = (borders: string[]): Record<string, number> => {
        const weightedBorders: any = {}
        borders.forEach(b => weightedBorders[b] = 1)
        return weightedBorders
    }

    const getShortestPath = useCallback((): string[] => {
        const bordersGraph: Graph = new Graph();
        // @ts-ignore
        Object.values(data.countries).forEach(g => {
            if (!bannedCountries.includes(g.iso)) {
                bordersGraph.addNode(g.iso, bordersWithWeights(g.borders))
            }
        })
        // @ts-ignore
        return bordersGraph.path(start, finish)
    }, [data, finish, start, bannedCountries])

    useEffect(() => {
        const yyyymmdd = parseInt((new Date()).toISOString().slice(0, 10).replace(/-/g, ""))
        const gameIndex = yyyymmdd % games.length
        setGameIndex(gameIndex)
        const todaysGame: GameT = games[gameIndex]
        setStart(todaysGame.from)
        setFinish(todaysGame.to)
        setBannedCountries(todaysGame.without)
        setGameLoaded(true)
    }, [games])

    useEffect(() => {
        setShortestPath(getShortestPath())
    }, [start, finish, getShortestPath])

    useEffect(() => {
        const timer = setTimeout(() => {
            const todaysGuesses = getGuesses()
            if (getGuesses().length === 0) {
                setLngLatFocus([data.countries[start].position[0], data.countries[start].position[1]])
                addGuess(data.countries[start].iso, data.countries[start].long_name, true)
            } else {
                const lastGuess = todaysGuesses.slice(-1)[0]
                setLngLatFocus([data.countries[lastGuess.iso].position[0], data.countries[lastGuess.iso].position[1]])
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [data, setLngLatFocus, start]);

    useEffect(() => {
        if (error === undefined) return
        const timer = setTimeout(() => {
            setError(undefined)
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    const getGuesses = (): Guess[] => {
        const guesses = guessesWithGameIndex[gameIndex]
        if (guesses === undefined) return []
        return guesses
    }

    useEffect(() => {
        if (getGuesses().filter(g => g.pass).map(g => g.iso).includes(finish)) {
            setGameState(1)
            return
        }
        const guessesleft = MAX_GUESSES - getGuesses().filter(g => !g.pass).length
        if (guessesleft < 1) setGameState(2)
    }, [guessesWithGameIndex, gameIndex, setGameState]);

    const addGuess = (iso: string, name: string, pass: boolean) => {
        // @ts-ignore
        const _guessesWithGameIndex = {...guessesWithGameIndex}
        _guessesWithGameIndex[gameIndex] = [...getGuesses(), {iso: iso, name: name, pass: pass}]
        setGuessesWithGameIndex(_guessesWithGameIndex)
    }

    const isBorderCountry = () => {
        const correctGuesses = getGuesses().filter(g => g.pass).map(g => g.iso)
        return correctGuesses.length === 0 || intersection(correctGuesses, data.countries[selectedCountry.iso].borders).length > 0
    }

    const submit = () => {
        setSelectedCountry(undefined)
        if (bannedCountries.includes(selectedCountry.iso)) {
            setError(`You cannot travel to ${selectedCountry.long_name}`)
            return
        }
        if (getGuesses().filter(g => g.pass).map(g => g.iso).includes(selectedCountry.iso)) {
            setError(`You have already visited to ${selectedCountry.long_name}`)
            return
        }
        if (isBorderCountry()) {
            addGuess(selectedCountry.iso, selectedCountry.long_name, true)
            setLngLatFocus([selectedCountry.position[0], selectedCountry.position[1]])
        } else {
            setError(`${selectedCountry.long_name} is not a bordering country`)
            if (getGuesses().filter(g => g.iso === selectedCountry.iso).length === 0) {
                addGuess(selectedCountry.iso, selectedCountry.long_name, false)
            }
        }
    }

    const renderGame = () => {
        return (
            <>
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
                        lives={getGuesses().filter(g => !g.pass).length}
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
                            countries={getGuesses().filter(g => g.pass).map(g => g.iso)}
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
                        <CountryList countries={getGuesses()}/> :
                        <CountryList countries={shortestPath.map(c => {
                            return {"name": data.countries[c].long_name, "iso": data.countries[c].iso}
                        })}/>
                    }
                </Box>
            </>
        )
    }

    return (
        <Box sx={{
            display: "block",
            position: "relative",
            height: "inherit",
            width: "inherit"
        }}>
            {gameLoaded ? renderGame() : null}
        </Box>
    );
}

export default Game;
