import React, {Component} from 'react'
import axios from 'axios'
import {ListGroup, Button, Spinner} from 'react-bootstrap'
import './GateWayList.css'
import SearchInput from '../SearchInput/SearchInput'
import GateWayInfoTable from '../GateWayInfoTable/GateWayInfoTable'
import GoogleMap from '../GoogleMap/GoogleMap'
import ActiveHistorytab from '../ActiveHistoryTab/ActiveHistoryTab'
import DatePicker from '../DatePicker/DatePicker'
import Tree from '@naisutech/react-tree'

class GateWayList extends Component {

    constructor(props){
        super(props)
        this.nodes = []
        this.state = {
            nodes: [],
            selectedGateway: "",
            longitude:["Please Select"],
            latitude: [],
            idleTime: [],
            filter: "",
            tab: '1',
            historyTime: [],
            historyLat: [],
            historyLong: "",
            fromDate: null,
            endDate: null,
            spinner: false
        }
    }
    
    searchInputChangeHandler = (event)=> {
        console.log('event ' + event.target.value)
        this.setState({
            filter: event.target.value
        })
    }

    searchInputClearBtnHandler = ()=>{
        this.setState({
            filter: ""
        })
    }

    callAllGatewaysApi = async () => {
        axios.get("http://localhost:5000/allGateways")
        .then(async response => {
            var data = JSON.parse(JSON.stringify(response)).data
            var allGateways = Object.keys(data)
            var allSubgroups = Object.values(data)[0]
            var node1 = {
                label: allGateways[0],
                id: allGateways[0],
                parentId: null,
                items: this.getItems(allGateways[0], allSubgroups)
            }
            var nodes = []
            nodes.push(node1)
            this.setState({
                nodes: nodes
            })
            console.log(this.state.nodes)
            var nds = await this.parseSubGroups(allGateways[0], allSubgroups)
            console.log(nds)
            
        })
    }


    getItems(id, groups){
        var items = []
        groups.forEach(group=>{
            var grpkeys = Object.keys(group)
            if(grpkeys.length === 2 && grpkeys.includes('uid') && grpkeys.includes('name')){
                var item = {
                    label: group.uid,
                    parentId: id,
                    id: group.uid
                  }
                  items.push(item)
            }
        })
        return items;
    }

    parseSubGroups(id, groups){ 
        groups.forEach(group => {
            var grpKeys = Object.keys(group)
            var grpkey = grpKeys[0]
            var grpValues = Object.values(group)[0]
            if(!grpKeys.includes('uid') && !grpKeys.includes('name')){
                var items = this.getItems(grpkey, grpValues)
                grpValues.forEach(grpVal => {
                    var grpValKeys = Object.keys(grpVal)
                    if(!grpValKeys.includes('uid') && !grpValKeys.includes('name')){
                        this.parseSubGroups(grpkey, [grpVal])
                    }
                })
                var node = {
                    label: grpkey,
                    id: grpkey,
                    parentId: id,
                    items: items
                  }
                var nodes = this.state.nodes
                nodes.push(node)
                this.setState({
                    nodes:nodes
                })
                  return 
            }
        })
    } 

    componentDidMount(){
        this.callAllGatewaysApi()
    }
    
    callInfoApi =  async (uid) => {
        axios.get('http://localhost:5000/gateway?nid=' + uid)
        .then(response=>{
            var data = JSON.parse(JSON.stringify(response)).data
            if(data['GPS Location-longitude'] == null && data.ReportIdleTime != null){
                this.setState({
                    longitude:"-",
                    latitude: "-",
                    idleTime: [data.ReportIdleTime[0].value],
                    historyLong: [],
                    historyLat: [],
                    historyTime: []
                })
            }
            if(data['GPS Location-longitude'] != null){
                var long = [""],
                    lat = [""],
                    idle = [""]
                if(data['GPS Location-longitude'][0].value){
                    long = [data['GPS Location-longitude'][0].value]
                }
                if(data['GPS Location-latitude'][0].value){
                    lat = [data['GPS Location-latitude'][0].value]
                }
                if(data.ReportIdleTime[0].value){
                    idle = [data.ReportIdleTime[0].value]
                }
                this.setState({
                    longitude: long,
                    latitude: lat,
                    idleTime: idle,
                    historyLong: [],
                    historyLat: [],
                    historyTime: []
                })
            }
        })
    }

    callHistoryApi = async (uid) => {
        axios.get('http://localhost:5000/gateway/history?nid=' + uid)
        .then(response=>{
            var data = JSON.parse(JSON.stringify(response)).data
            var long = []
            var lat = []
            var time = []
            if(data.lang != null){
                console.log(data)
                for(var i=0; i < data.lang['GPS Location-longitude'].length ; i++){
                    var date = new Date(data.lang['GPS Location-longitude'][i].timestamp)
                    long.push(data.lang['GPS Location-longitude'][i].value)
                    time.push(date.toString('dd'))
                    lat.push(data.lat['GPS Location-latitude'][i].value)
                }
            }
            this.setState({
                historyLong: long,
                historyLat: lat,
                historyTime: time,
                longitude:[],
                latitude: [],
                idleTime: []
            })
        })
        .then(()=>{
            this.sortDates()
        })
    }

    gatewaySelectHandler = (e) => {
        var ebjo = Object.keys(e)
        if(ebjo.includes("items")){
            console.log(e.id)
            return 
        }
        if(this.state.tab ===  '1'){
            this.setState({
                fromDate: null,
                endDate: null
            })
            this.callInfoApi(e.id)
        }else{
                this.setState({
                    spinner:true,
                    fromDate: null,
                    endDate: null
                })
                setTimeout(()=>{
                    this.setState({
                        spinner: false
                    })
                }, 3000);
            this.callHistoryApi(e.id)
        }
        this.setState({
            selectedGateway: e.id
        })
    }
    
    setTabHandler = ( value ) => {
        if(value === '1'){
            this.callInfoApi(this.state.selectedGateway)
            this.setState({
                tab: value,
                spinner: false
            })
        }else{
            this.setState({
                tab: value,
                spinner:true
            })
            this.callHistoryApi(this.state.selectedGateway)
            setTimeout(()=>{
                this.setState({
                    tab: value,
                    spinner: false
                })
            }, 3000);
        }
    }

    fromDateChangeHandler = (date) => {
        this.setState({
            fromDate: new Date(date)
        })
    }

    endDateChangeHandler = (date) =>{
        this.setState({
            endDate: new Date(date)
        })
    }

    sortDates = ()=>{
        console.log(this.state.fromDate)
        var time= []
        var long= []
        var lat= []
        if(this.state.fromDate != null && this.state.endDate != null){
            for(var i = 0 ; i < this.state.historyTime.length; i++){
                if(new Date(this.state.historyTime[i]).getTime() >= new Date(this.state.fromDate).getTime() && new Date(this.state.historyTime[i]).getTime() <= new Date(this.state.endDate).getTime()){
                    time.push(this.state.historyTime[i])
                    long.push(this.state.historyLong[i])
                    lat.push(this.state.historyLat[i])
                }
            }
            this.setState({
                historyLong: long,
                historyLat: lat,
                historyTime: time
            })
        }
    }

    clearDates = ()=> {
        if(this.state.fromDate != null || this.state.endDate != null){
            this.setState({
                spinner:true,
                fromDate: null,
                endDate: null
            })
            setTimeout(()=>{
                this.setState({
                    spinner: false
                })
            }, 3000);
        }
        this.callHistoryApi(this.state.selectedGateway)
    }

    getParents =  (node) => { 
        var result = []
        while(true){
            var copy = [...this.state.nodes]
            var parent  = copy
            .filter(nd=>{
                return nd.id === node.parentId
            })
            result=result.concat(parent)
            node = parent[0]
            if(node == null || node.parentId == null){
                break
            }
        }
        return result
    }  

    getChildren = (node) => {
        var result = []
        while(true){
            var copy = [...this.state.nodes]
            var parent  = copy
            .filter(nd=>{
                return nd.parentId === node.id
            })
            result=result.concat(parent)
            node = parent[0]
            if(node == null || node.parentId == null){
                break
            }
        }
        return result
    }
    
    cleanUpNodes = () => {
        var filter= this.state.filter.toLowerCase()
        var result = []
        const nodesCopy = [...this.state.nodes]
        // Have to create copies since js creates direct refrences to the list
        var withChars = []
        nodesCopy
        .forEach( gatewaygrp=>{
            var GatewayGrpCopy  = {...gatewaygrp}
            var labelmatch =GatewayGrpCopy.label.toLowerCase().indexOf(filter) >= 0
            if(labelmatch){
                withChars.push(GatewayGrpCopy)
                withChars = withChars.concat(this.getChildren(GatewayGrpCopy))
            }else{
                var itms = GatewayGrpCopy.items.filter(itm => {
                    return  itm.label.toLowerCase().indexOf(filter) >= 0
                 })
                 if(itms.length > 0 ){
                    GatewayGrpCopy.items = itms
                    withChars.push(GatewayGrpCopy)
                 }
            } 
        })

        withChars.forEach(withchr => {
            var rslt = this.getParents(withchr)
            console.log(rslt)
            var incs = result.filter(rs=>{
                return rs.id.localeCompare(withchr.id) === 0
            })
            if(incs.length === 0){
                result.push(withchr)
            }
            rslt.forEach(rt => { 
                console.log(rt)
                var Rtcopy = {...rt}
                var incs = result.filter(rs=>{
                    return rs.id === Rtcopy.id
                })
                if(incs.length === 0){
                    var labelmatch =Rtcopy.label.toLowerCase().indexOf(filter) >= 0
                    var itms = Rtcopy.items.filter(itm => {
                        return  itm.label.toLowerCase().indexOf(filter) >= 0
                    })
                    if(labelmatch){
                        result.push(Rtcopy)
                        result = result.concat(this.getChildren(Rtcopy))
                    }
                    else if(itms.length > 0){
                        Rtcopy.items = itms
                        result.push(Rtcopy)
                    }else{
                        Rtcopy.items = []
                        result.push(Rtcopy)
                    }
                }
            })
        })
        return result
    }

    render(){
        const searchEnable = this.state.fromDate != null && this.state.endDate != null
        var gatewaysGrps = this.state.nodes;
        if(this.state.filter.localeCompare("") !== 0){
            gatewaysGrps=this.cleanUpNodes()

        }
        const mystyle = {
            overflowY: "scroll",
            height: "500px"
          };
        var trre = (
            <div >
                <Tree nodes={gatewaysGrps} theme={'light'} containerStyle={mystyle}
                       onSelect={(e)=>{this.gatewaySelectHandler(e)}}             />
            </div>
        )
        var finalDisp ;

        if(this.state.tab == 1){
            finalDisp = (
                <div>
                     <div>
                        <GateWayInfoTable
                            leftColName = {'ReportIdleTime'}
                            longitude = {this.state.longitude}
                            latitude = {this.state.latitude}
                            idleTime = {this.state.idleTime}
                        />
                    </div>
                    <div>
                        <GoogleMap
                            long = {this.state.longitude}
                            lat = {this.state.latitude} 
                        />
                    </div>
                </div>
            )
        }else if(this.state.spinner === true){
            finalDisp = (
                <div>
                    <DatePicker 
                        name={'From: '}
                        dateChange= {this.fromDateChangeHandler}
                        startDate={this.state.fromDate}
                    />
                    <DatePicker
                        name={'To: '}
                        dateChange={this.endDateChangeHandler}
                        startDate={this.state.endDate}
                    />
                    <Button variant="primary" className="search" disabled={true}>Search</Button> 
                    <Button variant="outline-secondary" className="search">Loading...</Button>
                    <Spinner animation="grow"  className="spinner" /> 
                </div>      
            )
        }else{
            finalDisp= (
                <div>
                    <DatePicker 
                        name={'From: '}
                        dateChange= {this.fromDateChangeHandler}
                        startDate={this.state.fromDate}
                    />
                    <DatePicker
                        name={'To: '}
                        dateChange={this.endDateChangeHandler}
                        startDate={this.state.endDate}
                    />
                    <Button variant="primary" className="search" onClick= {this.sortDates} disabled={!searchEnable}>Search</Button>
                    <Button variant="outline-secondary" className="search" onClick={this.clearDates}>Clear</Button>
                    <GateWayInfoTable
                            leftColName = {'Timestamp'}
                            longitude = {this.state.historyLong}
                            latitude = {this.state.historyLat}
                            idleTime = {this.state.historyTime}
                        />
                </div>
            )
        }

        return (
            <div>
                <div>
                    <ActiveHistorytab 
                        setTab= {this.setTabHandler}
                        radioValue={this.state.tab}
                    />
                    <br/>
                    <br/>
                </div>
                <div className='lister'>
                    {
                        <SearchInput 
                        onChageHandler={this.searchInputChangeHandler}
                        clearBtnHandler={this.searchInputClearBtnHandler}
                        name={"Gateway uid"}
                    />
                    }
                    {trre}

                </div>
                {finalDisp}
            </div>
        )
    }
}

export default GateWayList;