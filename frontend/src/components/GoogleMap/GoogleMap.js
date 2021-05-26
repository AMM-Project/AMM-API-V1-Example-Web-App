import React, {Component} from 'react'
import './GoogleMap.css'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
const config = require('../../config.json')

class GoogleMap extends Component {

    constructor(props){
        super(props)
    }

    render() {
        console.log(this.props.lat)
        console.log(this.props.long)
        const containerStyle = { 
            width: '70%',
            height: '70%',
            marginLeft: '450px',
            marginTop: '95px'
          }
    
        return (
            <div>
                 <Map google={this.props.google} zoom={14}  containerStyle={containerStyle}
                  initialCenter={{
                    lat: this.props.lat,
                    lng: this.props.long
                  }}
                  center={{
                    lat: this.props.lat,
                    lng: this.props.long
                  }}
                  >
                    <Marker onClick={this.onMarkerClick}
                            name={'Current location'} 
                            position={{lat: this.props.lat, lng: this.props.long}}/>
                    <InfoWindow onClose={this.onInfoWindowClose}>
                        <div>
                        <h1>{'Vancouver'}</h1>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        )
    }


}

export default GoogleApiWrapper({
    apiKey: (config.maps_api_key)
  })(GoogleMap)