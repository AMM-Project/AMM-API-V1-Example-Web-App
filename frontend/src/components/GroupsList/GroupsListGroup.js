import React, {Component} from 'react';
import axios from 'axios'; 
import './GroupsListGroup.css'
import SearchInput from '../SearchInput/SearchInput'
import Tree from '@naisutech/react-tree'
import {Button} from 'react-bootstrap'
 
class GatewayListGroup extends Component{

    constructor(props){
        super(props)
        this.state = {
            groups:[],
            recieved: false,
            groupFilter: ""
          }
    }

    callGroupsApi =  () => {
        axios.get('http://localhost:5000/groups')
        .then(response=>{
            if(response.headers['content-length'] > 0){
                this.setState({
                    groups: response.data.subgroups,
                    recieved: true
                })
            }
        })
    }

    componentDidMount(){
        var maxTries = 2
        while(this.state.recieved !== true && maxTries > 0){
            maxTries--;
            this.callGroupsApi()
        }
    }

    parseGroup = (parentID, group) => {
        var parsedGroup = JSON.parse(JSON.stringify(group))
        var key = Object.keys(parsedGroup)
        var value = JSON.parse(JSON.stringify(Object.values(parsedGroup)[0]))
        var packet = {
            "id": value.id,
            "parentId": parentID,
            "label": key,
            "subgroups": value.subgroups
        }
        return packet
    }

    parseSubGroups = (id, groups) => {
        var result = []
        groups.forEach((group)=>{
            var parsedGroup = this.parseGroup(id, group)
            var res = this.parseSubGroups(parsedGroup.id, parsedGroup.subgroups) 
            var temp = [parsedGroup]
            temp = temp.concat(res)
            result = result.concat(temp)
        })
        return result
    }
    

    searchInputChangeHandler = (event)=> {
          this.setState({
            groupFilter: event.target.value
          })
    }
    
    searchInputClearBtnHandler = ()=>{
        this.setState({
            groupFilter: ""
        })
    }
    

    render() {
        const groups = this.state.groups
        .filter( group=>{
            var name = Object.keys(JSON.parse(JSON.stringify(group))).toString()
            var filter= this.state.groupFilter.toLowerCase()
            return name.toLowerCase().indexOf(filter) >= 0
        })
        .map( group=> {
            var res = this.parseGroup(null, group)
            return res
        })
        var data = []
        groups.forEach( (group)=>{
            data.push(group)
            data = data.concat(this.parseSubGroups(group.id, group.subgroups))
        })
        const mystyle = {
            overflowY: "scroll",
            height: "500px"
          };

        return ( 
            <div className="Accord">
                <Button variant="outline-primary" onClick={this.callGroupsApi}>Reload</Button>
                <SearchInput 
                    onChageHandler={this.searchInputChangeHandler}
                    clearBtnHandler={this.searchInputClearBtnHandler}
                    name={"Group Name"}
                />
                <div style={mystyle} >
                    <Tree nodes={data}/>
                </div>
            </div>
            
        )
    }
}


export default GatewayListGroup;