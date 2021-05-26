import React from 'react'
import {Navbar, Nav, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import axios from 'axios'


const NavBar = ( props ) => {

    function logoutHandler() {
        axios.get('http://localhost:5000/authenticate/revoke')
        .then(response => {
            console.log(response)
            if(response.data === "OK"){
                window.location.reload(false)
            }
        })
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
                <h5>API Demo App</h5>
                <img src= {require("../../assets/photos/SierraWireless_logo.png")} alt="Sierra Wireless logo" />
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link><Link to="/gateways">Gateways</Link></Nav.Link>
                <Nav.Link><Link to="/groups">Groups</Link></Nav.Link>
            </Nav>
            <Nav className="navbar-right">
                <Button variant="warning" onClick={logoutHandler}>Logout</Button>
            </Nav>
      </Navbar>
    )
}

export default NavBar;