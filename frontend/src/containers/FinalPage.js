import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import GatewayList from '../components/GatewayList/GateWayList'
import GroupList from '../components/GroupsList/GroupsListGroup'



class FinalPage extends Component{


    render(){
      
            var finalDisp = (
                <div>
                    <Route path="/" exact component={GatewayList} />
                    <Route path="/gateways" exact component={GatewayList} />
                    <Route path="/groups" exact component={ GroupList} />
                </div>
            )
        return(
            <div>
                {finalDisp}
            </div>
        )
    }
}

export default FinalPage;