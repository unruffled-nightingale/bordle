import React, {memo} from 'react';
import {Close} from "@mui/icons-material";
import {Box} from "@mui/material";
import {MAX_GUESSES} from "../constants";


type GuessesProps = {
    lives: number
}

const Guesses = ({lives}: GuessesProps) => {
    console.log(lives)
    return <Box>
        {Array.from(Array(MAX_GUESSES).keys()).map(i =>
            <Close
                key={i}
                sx={{
                    color: i <= lives - 1 ? "red" : "lightgrey",
                    fontSize: 24,
                }}/>
        )}
    </Box>
}

export default memo(Guesses);
