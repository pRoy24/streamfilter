import React, {Component} from 'react';
import {Row, Col, ListGroup, ListGroupItem, ButtonToolbar, ButtonGroup, Button} from 'react-bootstrap';
import './sections.css';

export default class RoomCurrentFeed extends Component {
    render() {
        
                const {rawLines} = this.props;
let lineTraining = rawLines.map(function(item){
    return (
        <ListGroupItem>
        <Row>
            <Col lg={10} style={{"float": "left", "textAlign":"left"}}>
              {item.sentence}
            </Col>
            <Col lg={2}>
                <ButtonToolbar>
                                  Accuracy  
                  <ButtonGroup bsSize="small">

                    <Button >1</Button>
                    <Button >2</Button>
                    <Button >3</Button>
                    <Button >4</Button>
                    <Button>5</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                
                <ButtonToolbar>
                       Relevance
                  <ButtonGroup bsSize="small">
                    <Button>1</Button>
                    <Button>2</Button>
                    <Button>3</Button>
                    <Button>4</Button>
                    <Button>5</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Button className="vote-submit-button">Submit</Button>
                
                
            </Col>
        </Row>
        </ListGroupItem>
        )
})

        return (
            <Row className="row-container">
              <Col lg={12} className="current-feed-container">
                            <ListGroup>

                {lineTraining}
            </ListGroup>
            
              </Col>    
            </Row>
            )
    }
}