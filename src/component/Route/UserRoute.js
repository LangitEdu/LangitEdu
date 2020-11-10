import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import RouteName from '../../config/Route';

export default function UserRoute({component : Component, ...rest}) {

    const { currentUser } = useAuth();
    // let uid = rest.computedMatch.params.uid;
    if(!currentUser){
        return (
            <Route
            {...rest}
            render = {props=>{
               return <Redirect {...props} to={RouteName.login} />
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
