import React from "react";

type FlagProps = {
    iso: string
}

const Flag = ({iso}: FlagProps) => <img
    style={{display: "inline"}}
    loading="lazy"
    width="20"
    src={`https://flagcdn.com/w20/${iso.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w40/${iso.toLowerCase()}.png 2x`}
    alt=""
/>

export default Flag