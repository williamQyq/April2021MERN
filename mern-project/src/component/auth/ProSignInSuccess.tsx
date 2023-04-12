import React, { useEffect } from 'react'

interface Props {

}

const ProSignInSuccess: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        setTimeout(() => {
            window.close()
        }, 1000);

    }, [])

    return (
        <div>ProSignInSuccess</div>
    )
}

export default ProSignInSuccess