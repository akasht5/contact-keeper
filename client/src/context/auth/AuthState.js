import React,{ useReducer } from 'react'
import setAuthToken from '../../utils/setAuthToken'
import AuthContext from './authContext'
import authReducer from './authReducer'
import axios from 'axios'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../contact/types.js'

const AuthState = (props) => {
    const initialState = {
        token : localStorage.getItem('token'),
        isAuthenticated : null,
        loading : true,
        user : null,
        error : null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    //Load User
    const loadUser = async () => {
        //Load token in global headers
        if(localStorage.token){
            setAuthToken(localStorage.token);
        }
        try {
            const res = await axios.get('/api/auth');
            dispatch({
                type : USER_LOADED,
                payload : res.data
            });
        } catch (error) {
            dispatch({
                type : AUTH_ERROR
            })
        }
    }
    //Register User
    const register = async formData => {
        const config = {
            header : {
                'Context-Type':'application/json'
            }
        }
        try {
            const res = await axios.post('/api/users',formData,config);
            dispatch({
                type : REGISTER_SUCCESS,
                payload : res.data
            });

            loadUser();
        } catch (error) {
            dispatch({
                type : REGISTER_FAIL,
                payload : error.response.data.msg
            });
        }
    }

    //Login a user
    const login = async formData => {
        const config = {
            header : {
                'Context-Type':'application/json'
            }
        }
        try {
            const res = await axios.post('/api/auth',formData,config);
            dispatch({
                type : LOGIN_SUCCESS,
                payload : res.data
            });

            loadUser();
        } catch (error) {
            dispatch({
                type : LOGIN_FAIL,
                payload : error.response.data.msg
            });
        }
    }


    //Logout a user
    const logout = () => dispatch({ type:LOGOUT });

    //Clear all errors
    const clearErrors = () => dispatch({ type : CLEAR_ERRORS });

    return (
        <AuthContext.Provider value={{
            token : state.token,
            isAuthenticated : state.isAuthenticated,
            loading : state.loading,
            user : state.user, 
            error : state.error,
            register,
            login,
            logout,
            clearErrors,
            loadUser
        }}>
            {props.children}
        </AuthContext.Provider>
    )


}

export default AuthState;