import React from 'react';
import './LoginForm.css';
import {Button} from 'react-bootstrap';

const LoginForm = ( props ) =>  {

    return (
        <div className="LoginForm">
            <img src= {require("../../assets/photos/SierraWireless_logo.png")} alt="Sierra Wireless logo" className="logo"/>
            <h4>API Demo</h4>
            <Button variant="primary" onClick={props.loginButtonHandler} >
                Login with AMM
            </Button>
        </div>
    )
}

export default LoginForm;