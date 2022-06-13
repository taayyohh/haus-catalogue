import React from 'react'
import Nav   from './Nav'
import {useSigner} from "wagmi";
import {useLayoutStore} from "stores/useLayoutStore";


type Props = {
    children: JSX.Element,
}

const Layout = ({children}: Props) => {
    const { data, isError, isLoading } = useSigner()
    const { setSigner, setProvider } = useLayoutStore()
    const signer = React.useMemo(() => {
        return data
    }, [isLoading, isError, data])

    React.useEffect(() => {
        if (!!signer) {
            setSigner(signer)
            setProvider(signer?.provider)
        }
    }, [signer])




    return (
        <>
            <Nav />
            {children}
        </>
    )
}

export default Layout
