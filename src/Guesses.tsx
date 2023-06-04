import React from 'react';
import './App.css';
import Flag from "./Flag";
import {Guess} from "./Game";
import {Close} from "@mui/icons-material";


type GuessesProps = {
    guesses: Guess[]

}

const Guesses = ({guesses}: GuessesProps) => {

    return <div>
        {[1,2,3].map(i => <Close sx={{color: i <= guesses.filter(g => !g.pass).length ? "red" : "lightgrey"}}/>)}
        {guesses.map(g => (
            <div style={{display: "block", paddingTop: "6px", paddingLeft: "6px"}}>
                <Flag iso={g.iso}/>
                <p style={{color: g.pass ? "green" : "red", display: "inline", paddingLeft: "12px"}}>{g.name}</p>
            </div>
        ))}
    </div>
}

export default Guesses;
