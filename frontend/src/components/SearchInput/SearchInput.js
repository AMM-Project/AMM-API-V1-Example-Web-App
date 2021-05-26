import React from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import './SearchInput.css';

const SearchInput = ( props ) =>  {

    const textInput = React.useRef();
    const clearBtnHandler = () => {
        var temp = props.clearBtnHandler
        temp()
        textInput.current.value = ""
        
    }
    return (
        <div className="SearchInput">
            <InputGroup className="mb-3">
                <FormControl
                    placeholder={props.name}
                    aria-label={props.name}
                    aria-describedby="basic-addon2"
                    ref={textInput}
                    onChange={props.onChageHandler}
                />
                <InputGroup.Append>
                <Button variant="outline-success" onClick={clearBtnHandler}>Clear</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default SearchInput;