import React, {Component} from 'react'
import {Table} from 'react-bootstrap'
import './GateWayInfoTable.css'

class GateWayInfoTable extends Component {

    render(){
        const mystyle = {
            overflowY: "scroll",
            height: "500px"
          };
        var rows = [];
        for(var i=0; i<this.props.idleTime.length;  i++){
            var row ;
            if(this.props.longitude[i] == null){
                row = (
                    <tr>
                        <td>{this.props.idleTime[i]}</td>
                        <td>{'-'}</td>
                        <td>{'-'}</td>
                    </tr>
                )
            }else{
                row = (
                    <tr>
                        <td>{this.props.idleTime[i]}</td>
                        <td>{this.props.longitude[i]}</td>
                        <td>{this.props.latitude[i]}</td>
                    </tr>
                )
            }
            rows.push(row)
        }
        return(
            <div className="Table" style={mystyle}>
                <Table striped bordered hover variant="dark" >
                    <thead>
                        <tr>
                        <th>{this.props.leftColName}</th>
                        <th>GPS Location-longitude</th>
                        <th>GPS Location-latitude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default GateWayInfoTable;