import React,{useReducer} from 'react'
import AlertContext from './alertContext'
import alertReducer from './alertReducer'
import {v4 as uuid} from 'uuid'
import {
    SET_ALERT,
    REMOVE_ALERT
} from '../contact/types'

const AlertState = (props) => {
    const initialState = [];

    const [state, dispatch] = useReducer(alertReducer, initialState);

    //Set Alert
    const setAlert = (type,msg,timeout = 5000) => {
        const id = uuid();
        dispatch({
            type : SET_ALERT,
            payload : {
                id,type,msg
            }
        })

        setTimeout(() => {
            dispatch({
                type : REMOVE_ALERT,
                payload : id
            })
        },timeout)
    }

    return (
        <AlertContext.Provider value={{
            alerts:state,
            setAlert
        }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState
 