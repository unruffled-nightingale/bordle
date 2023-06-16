import React, {memo} from "react";

type FlagProps = {
    iso: string
    width: number
}

const Flag = ({iso, width}: FlagProps) => <img
    style={{display: "inline"}}
    loading="lazy"
    width={width}
    src={`https://flagcdn.com/w20/${iso.toLowerCase()}.png`}
    srcSet={`https://flagcdn.com/w40/${iso.toLowerCase()}.png 2x`}
    alt=""
/>

export default memo(Flag)