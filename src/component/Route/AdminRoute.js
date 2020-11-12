import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import RouteName from '../../config/Route';

export default function AdminRoute({component : Component, ...rest}) {

    const { currentUser, IsAdmin } = useAuth();
    
    if(!IsAdmin){
        return (
            <Route
            {...rest}
            render = {props=>{
               return <Redirect {...props} to={RouteName.home} />
            }}
            ></Route>
        )
    }
    return (
        <Route
            {...rest}
            render = {props=>{
               return currentUser ? <Component {...props} /> : <Redirect to={RouteName.login} />
            }}
        >
            
        </Route>
    )
}
