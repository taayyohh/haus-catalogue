import React from 'react'
import Nav   from './Nav'
import {useSigner} from "wagmi";
import {useLayoutStore} from "stores/useLayoutStore";


type Props = {
    children: JSX.Element,
}

const Layout = ({children}: Props) => {
    const { data, isError, isLoading } = useSigner()
    // @ts-ignore //TODO: ??
    const { setSigner } = useLayoutStore()
    /* Save Signer Object globally */
    const signer = React.useMemo(() => {
        return data
    }, [isLoading, isError, data])

    React.useEffect(() => {
        if (!!signer) setSigner(signer)
    }, [signer])


    return (
        <>
            <Nav />
            {children}
        </>
    )
}

export default Layout
