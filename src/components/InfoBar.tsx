import {Box} from "@mui/material";
import React from "react";

type InfoBarProps = {
    gameState: number
    error: string | undefined
}

const InfoBar = ({gameState, error}: InfoBarProps) => {

    return <Box sx={{height: "35px", textAlign: "center", paddingTop: "12px"}} >
        {error ? <p style={{color: "red", margin: 0, fontSize:"14px"}}>{error}</p> : null}
        {gameState === 1 && !error ? <p style={{color: "green", fontSize:"20px", fontWeight: "bold", margin: 0}}>You WIN!</p> : null}
        {gameState === 2 && !error ? <p style={{color: "red", fontSize:"20px", fontWeight: "bold", margin: 0}}>You are a LOSER!</p> : null}
    </Box>


}

export default InfoBar