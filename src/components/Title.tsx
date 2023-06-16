import React, {useEffect, useState, memo} from "react";

type TitleProps = {
    start: string
    finish: string
    bannedCountries: string[]
}

const Title = ({start, finish, bannedCountries}: TitleProps) => {

    const [firsts, setFirsts] = useState<string[]>([])
    const [last, setLast] = useState<string | undefined>("")

    useEffect(() => {
        const banned = Array.from(bannedCountries)
        if (banned.length > 1) {
            setLast(banned.pop())
            setFirsts(banned)
        } else {
            setFirsts(banned)
        }
    }, [bannedCountries])
    return (
        <div style={{display: "block"}}>
            <p style={{color: "black", fontSize: "14px", lineHeight: "20px"}}>
                Get from <b>{start}</b> to <b>{finish}</b>
                <br/>
                {
                    bannedCountries.length > 1 ?
                        <span> ... without visiting {
                            firsts.map(b =>
                                <span style={{color: "red"}}><b>{b}</b><span style={{color: "black"}}>, </span></span>
                            )} or <span style={{color: "red"}}><b>{last}</b></span>
                    </span> :
                        bannedCountries.length === 1 ?
                            <span> ... without visiting <span style={{color: "red"}}><b>{bannedCountries}</b></span></span>
                            : null
                }</p>
        </div>
    )
}

export default memo(Title)