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

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            }
        }
    });

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
                        <Game
                            games={games.current}
                            data={data.current}
                        />
            </Box>
        </ThemeProvider>
    );
}

export default App;
