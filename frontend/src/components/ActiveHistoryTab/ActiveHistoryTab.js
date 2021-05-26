import React from 'react'
import {ButtonGroup, ToggleButton} from 'react-bootstrap'

const ActiveHistoryTab = ( props ) => {

    const radios = [
        { name: 'Active', value: '1' },
        { name: 'History', value: '2' }
    ];

    return (
        <ButtonGroup toggle>
            {radios.map((radio, idx) => (
                <ToggleButton
                    key={idx}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={radio.value}
                    checked={props.radioValue === radio.value}
                    onChange={(e) => props.setTab(e.currentTarget.value)}
                >
                    {radio.name}
                </ToggleButton>
            ))}
        </ButtonGroup>
    )
}

export default ActiveHistoryTab;