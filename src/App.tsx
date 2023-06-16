import React, {useCallback, useEffect, useRef, useState} from 'react';
import _data from './data/country.json';
import _games from './data/games.json';
// @ts-ignore
import Graph from "node-dijkstra"
import {Data, GameT} from "./types/types";
import Game from "./components/Game";
import {Box, createTheme, ThemeProvider} from "@mui/material";
import {ASPECT_RATIO} from "./constants";


function App() {

    const data = useRef<Data>(_data)
    const games = useRef<GameT[]>(_games)

    const [gameLoaded, setGameLoaded] = useState<boolean>(false)
    const [shortestPath, setShortestPath] = useState<string[]>([])
    const [start, setStart] = useState<string>("")
    const [finish, setFinish] = useState<string>("")
    const [bannedCountries, setBannedCountries] = useState<string[]>([])

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            }
        }
    });

    const bordersWithWeights = (borders: string[]): Record<string, number> => {
        const weightedBorders: any = {}
        borders.forEach(b => weightedBorders[b] = 1)
        return weightedBorders
    }

    const getShortestPath = useCallback((): string[] => {
        const bordersGraph: Graph = new Graph();
        // @ts-ignore
        Object.values(data.current.countries).forEach(g => {
            if (!bannedCountries.includes(g.iso)) {
                bordersGraph.addNode(g.iso, bordersWithWeights(g.borders))
            }
        })
        // @ts-ignore
        return bordersGraph.path(start, finish)
    }, [data, finish, start, bannedCountries])

    useEffect(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        const game: GameT = games.current[d.getTime() % games.current.length]
        setStart(game.from)
        setFinish(game.to)
        setBannedCountries(game.without)
        setGameLoaded(true)
    }, [])

    useEffect(() => {
        setShortestPath(getShortestPath())
    }, [start, finish, getShortestPath])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                height: "100%",
                width: window.innerHeight / ASPECT_RATIO,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                {
                    gameLoaded ?
                        <Game
                            start={start}
                            finish={finish}
                            data={data.current}
                            shortestPath={shortestPath}
                            bannedCountries={bannedCountries}
                        /> :
                        null
                }
            </Box>
        </ThemeProvider>
    );
}

export default App;
