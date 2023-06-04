import React from "react";

type TitleProps = {
    start: string
    finish: string
}

const Title = ({start, finish}: TitleProps) => {

    return (
        <p style={{color: "black", fontSize: "20px"}}>Get from {start} to {finish}</p>
    )
}

export default Title