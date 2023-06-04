import {Autocomplete, Box, Button, ButtonProps, styled, TextField} from "@mui/material";
import React, {SyntheticEvent, useState} from "react";
import {Country} from "./Country";
import Flag from "./Flag";

type InputProps = {
    disabled: boolean
    selectedCountry: Country,
    countries: Country[],
    setSelectedCountry: (x: Country | null) => void
    submit: (x: void) => void
}

const ColorButton = styled(Button)<ButtonProps>(({theme}) => ({
    color: "black",
    marginTop: "20px",
    border: "1px solid grey",
    backgroundColor: "white",
    '&:hover': {
        border: "1.5px solid black",
        fontWeight: "bold",
        backgroundColor: "lightgrey"
    },
}));

const Input = ({countries, selectedCountry, setSelectedCountry, disabled, submit}: InputProps) => {

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

    return <>
        <Autocomplete
            disabled={disabled}
            open={inputValue.length > 0 && selectedCountry == null}
            options={countries.filter(c => c.long_name.toLowerCase().startsWith(inputValue.toLowerCase()))}
            sx={{width: "100%", paddingLeft: "10px"}}
            size={"small"}
            onChange={onChange}
            onInputChange={onInputChange}
            inputValue={inputValue}
            getOptionLabel={(option: Country) => option.long_name}
            renderOption={(props, option) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                    <Flag iso={option.iso}/>
                    {option.long_name}
                </Box>
            )}
            renderInput={(params) =>
                <TextField {...params} variant={"standard"} label="" placeholder="Select a country..."/>}
        />
        <ColorButton onClick={onSubmit} disabled={disabled || inputValue === ""} variant="outlined"><p
            style={{margin: 0}}>SUBMIT</p></ColorButton>
    </>


}

export default Input