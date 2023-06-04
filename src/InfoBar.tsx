import {Autocomplete, Box, TextField} from "@mui/material";
import React, {SyntheticEvent, useState} from "react";
import {Country} from "./Country";

type InfoBarProps = {
    gameState: number
    error: string | undefined
}

const InfoBar = ({gameState, error}: InfoBarProps) => {

    return <div>
        {error ? <p style={{color: "red", textAlign: "left"}}>{error} is not a bordering country</p> : <p><br/></p>}
        {gameState === 1 ? <p style={{color: "green"}}>You WIN!</p> : null}
        {gameState === 2 ? <p style={{color: "red"}}>You are a LOSER!</p> : null}
    </div>


}

export default InfoBar