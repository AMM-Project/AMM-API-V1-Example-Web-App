import React from 'react'
import {Accordion, Card} from 'react-bootstrap'
import './GroupListItem.css'

const GroupListItem = ( props ) => {

    return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={props.eventKey}>
                {props.groupName}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={props.eventKey}>
                <Card.Body>{props.groupinfo}</Card.Body>
                </Accordion.Collapse>
            </Card>
    )
}

export default GroupListItem;