import React, {memo} from 'react';
import Flag from "./Flag";
import {Box} from "@mui/material";

type CountryListType = {
    iso: string
    name: string
    pass?: boolean
}

type CountryListProps = {
    countries: CountryListType[]

}

const CountryList = ({countries}: CountryListProps) => {

    const getUniqueKey = (country: CountryListType) => {
        return `${country.iso}${country.pass === true ? "p" : country.pass === false ? "f" : ""}`
    }

    return <Box sx={{paddingBottom: "30px"}}>
        {countries.map(c => (
            <Box
                key={getUniqueKey(c)}
                style={{
                    display: "inline-block",
                    paddingLeft: "6px",
                    paddingRight: "18px",
                    minWidth: "70px",
                    width: "calc((100% / 3) - 24px)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                <Flag iso={c.iso} width={15}/>
                <p style={{
                    color: c.pass === true ? "green" : c.pass === false ? "red" : "black",
                    fontSize: "12px",
                    display: "inline",
                    paddingLeft: "6px"
                }}>{c.name}</p>
            </Box>
        ))}
    </Box>
}

export default memo(CountryList);
