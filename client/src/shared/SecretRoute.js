import React from 'react'
import {Redirect, Route} from 'react-router-dom'

import utils from '../utils'

const SecretRoute = (props) => {

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

            utils.logout()

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
        return <Route {...props}/>
    } else {
        return <Redirect to="/login"/>
    }
}

export default SecretRoute