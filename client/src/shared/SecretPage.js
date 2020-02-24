import React from 'react'
import {Redirect} from 'react-router-dom'

import utils from '../utils'

const SecretPage = (props) => {

    const [state, setState] = React.useState({
        loading: true,
        authorized: false
    })

    React.useEffect(() => {
        utils.checkToken().then(() => {
            setState({
                loading: false,
                authorized: true
            })
        }).catch(() => {
            setState({
                loading: false,
                authorized: false
            })
        })
    }, [])


    if(state.loading){
        return <div>loading...</div>
    }
    else if(!state.loading && state.authorized){
        return props.children
    } else {
        return <Redirect to="/login"/>
    }
}

export default SecretPage