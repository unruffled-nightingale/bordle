import React, {useCallback, useEffect, useState} from 'react';
import _data from './data.json';
import './App.css';
// @ts-ignore
// import dijkstra from "dijkstra"
// @ts-ignore
import Graph from "node-dijkstra"
import {Country} from "./Country";
import Game from "./Game";


function App() {

    const MAX_GUESSES = 3

    const [data, setData] = useState<Record<string, Country>>(_data)
    const [start, setStart] = useState<string>("ES")
    const [finish, setFinish] = useState<string>("MA")
    const [shortestPath, setShortestPath] = useState<string[]>([])

    const bordersWithWeights = (borders: string[]): Record<string, number> => {
        const weightedBorders: any = {}
        borders.forEach(b => weightedBorders[b] = 1)
        return weightedBorders
    }

    const getShortestPath = useCallback((): string[] => {
        const bordersGraph: Graph = new Graph();
        // @ts-ignore
        Object.values(data).forEach(g => bordersGraph.addNode(g.iso, bordersWithWeights(g.borders)))
        // @ts-ignore
        return bordersGraph.path(start, finish)
    }, [])

    useEffect(() => {
        setShortestPath(getShortestPath())
    }, [data, start, finish, getShortestPath])

    return (
        <div style={{height: "100vh"}}>
            <Game
                start={start}
                finish={finish}
                data={data}
                shortestPath={shortestPath}
            />
        </div>
    );
}

export default App;
