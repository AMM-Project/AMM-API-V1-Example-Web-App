import React from "react";
import DateTimePicker  from "react-datetime-picker";
import './DatePicker.css'
 
import "react-datepicker/dist/react-datepicker.css";
 
class Example extends React.Component {
 
  render() {
    return (
        <div className="Divi">
            <label>{this.props.name}</label>{' '}
                <DateTimePicker
                    id={this.props.name}
                    value={this.props.startDate}
                    onChange={this.props.dateChange}
                />
        </div>
    );
  }
}

export default Example;