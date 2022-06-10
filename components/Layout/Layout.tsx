import React from 'react'
import Nav   from './Nav'
import exp from "constants";

type Props = {
    children: JSX.Element,
}

const Layout = ({children}: Props) => {
    return (
        <>
            <Nav />
            {children}
        </>
    )
}

export default Layout
