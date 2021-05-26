import React, {Component} from 'react'
import './App.css'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import FinalPage from './FinalPage'
import LoginForm from '../components/LoginForm/LoginForm'
import NavBar from '../components/NavBar/NavBar'
import {BrowserRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap'

class App extends Component{

  openedWindow;
  constructor(props){
      super(props)
      this.state = {
          accessToken:"",
          ready: false
      }
      this.eventSrc = new EventSource('http://localhost:5000/authenticate/success')
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log(nextState.accessToken)
      if(nextState.ready === true &&  nextState.accessToken.localeCompare('') !== 0 ){
        console.log('Satnam here')  
        console.log('  ' + this.state.accessToken )
        console.log(nextState.accessToken)
        this.closeAuthWindow()
          return true
      }
      return false
  }

  componentDidMount(){
  this.eventSrc.onmessage = e =>{
    console.log(e.data)
      if(this.state.accessToken.localeCompare('') === 0 && e.data.localeCompare('') !== 0){
          this.setState({
              accessToken: e.data
          })
          if(this.state.accessToken.localeCompare('') !== 0){
              this.eventSrc.close()
          }
      }}
  }

  closeAuthWindow = () =>{
      this.openedWindow.close()
  }


  loginButtonHandler = ()=>{
      this.openedWindow = window.open('http://localhost:5000/authenticate/')
      this.setState({
          ready:true
      })
  }

  refreshBtnHandler = async ()=>{
    axios.get('http://localhost:5000/authenticate/refresh')
    .then(response=>{
      console.log(response.data)
      this.setState({
        accessToken: response.data
      })
    })
  }


  render(){
    var finalDisp ;
        if(this.state.accessToken.localeCompare('') !== 0 ){
          finalDisp= (
            <div>
              <NavBar/>
              <div classname="Token">
                <br></br>
                <Button variant="outline-info" onClick={this.refreshBtnHandler}>Refresh Token</Button>
              </div>
              <div classname="Token">
                <p>{'Your access token is ' + this.state.accessToken}</p>
              </div>
              <FinalPage/>
            </div>
          )
        }else{
          finalDisp = (
            <LoginForm 
                loginButtonHandler = {this.loginButtonHandler}
            />
          )
        }
    return (
      <BrowserRouter>
          <div className="App">
           {finalDisp}
          </div>
      </BrowserRouter>
    );
  }

}

export default App;
