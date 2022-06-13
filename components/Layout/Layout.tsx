import React from 'react'
import Nav   from './Nav'
import {useSigner} from "wagmi";
import {useLayoutStore} from "stores/useLayoutStore";


type Props = {
    children: JSX.Element,
}

const Layout = ({children}: Props) => {
    const { data, isError, isLoading } = useSigner()
    // @ts-ignore
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
        <div className="bg-rose-50 min-h-screen">
            <Nav />
            {children}
        </div>
    )
}

export default Layout
