import {Autocomplete, Box, Button, TextField} from "@mui/material";
import React, {memo, SyntheticEvent, useState} from "react";
import {Country} from "../types/types";
import Flag from "./Flag";
import Guesses from "./Guesses";

type InputProps = {
    gameState: number
    selectedCountry: Country,
    countries: Country[],
    setSelectedCountry: (x: Country | null) => void
    submit: (x: void) => void
    showShortestPath: boolean
    setShowShortestPath: (x: boolean) => void
    lives: number
}


const Input = ({
                   countries,
                   selectedCountry,
                   setSelectedCountry,
                   gameState,
                   submit,
                   showShortestPath,
                   setShowShortestPath,
                   lives
               }: InputProps) => {

    const [inputValue, setInputValue] = useState<string>("");

    const onChange = (e: SyntheticEvent<Element, Event>, f: Country | null) => {
        setSelectedCountry(f)
    }

    const onInputChange = (e: SyntheticEvent<Element, Event>, f: string) => {
        setSelectedCountry(null)
        if (e !== null) setInputValue(f)
    }

    const onSubmit = (e: SyntheticEvent<Element, Event>) => {
        setInputValue("")
        submit()
    }

    return <Box sx={{width: "100%"}}>
        <Box sx={{display: "block", zIndex: 999100, position: "static"}}>
            <Autocomplete
                disabled={gameState !== 0}
                disablePortal={false}
                open={inputValue.length > 0 && selectedCountry == null}
                options={countries.filter(c => c.long_name.toLowerCase().startsWith(inputValue.toLowerCase()))}
                sx={{width: "100%", zIndex: 10000000}}
                size={"small"}
                onChange={onChange}
                onInputChange={onInputChange}
                inputValue={inputValue}
                getOptionLabel={(option: Country) => option.long_name}
                renderOption={(props, option) => (
                    <Box component="li" sx={{'& > img': {mr: 2, zIndex: 10000, position: "relative"}}} {...props}>
                        <Flag iso={option.iso} width={20}/>
                        {option.long_name}
                    </Box>
                )}
                renderInput={(params) =>
                    <TextField {...params} variant={"standard"} label="" placeholder="Select a country..."/>}
            />

            <Box sx={{
                display: "block",
                position: "static",
                width: "100%",
                textAlign: "center",
                paddingTop: "12px",
                zIndex: -100
            }}>
                {
                    gameState === 0 ?
                        <Button
                            onClick={onSubmit}
                            disabled={inputValue === ""}
                            variant="outlined"
                            sx={{
                                borderRadius: "0px",
                                width: "100%",
                                margin: 0,
                            }}>
                            SUBMIT
                        </Button> :
                        <Button
                            variant="outlined"
                            onClick={() => setShowShortestPath(!showShortestPath)}
                            sx={{borderRadius: "0px", width: "100%"}}>
                            <p style={{margin: 0}}>SHOW {showShortestPath ? "YOUR" : "SHORTEST"} PATH</p></Button>
                }
            </Box>
            <Box sx={{display: "block", textAlign: "center", width: "100%", marginTop: "6px"}}>
                <Guesses lives={lives}/>
            </Box>
        </Box>
    </Box>


}

export default memo(Input)