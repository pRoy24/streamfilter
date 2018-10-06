import React, {Component} from 'react';
import axios from 'axios';
import {Row, Col, Grid, ListGroup, ListGroupItem, Button, ButtonGroup} from 'react-bootstrap';

export default class Trainer extends Component {
    constructor(props) {
        super(props);
        this.state = {"rawLines": []}
    }
    componentWillMount() {
        const self = this;
        axios.get("http://34.217.192.198:3011/raw-news-lines").then(function(response){
            self.setState({rawLines: response.data.data});
        });
    }
    
    render() {
        const {rawLines} = this.state;
let lineTraining = rawLines.map(function(item){
    return (
        <ListGroupItem>
        <Row>
            <Col lg={10} style={{"float": "left", "textAlign":"left"}}>
              {item.sentence}
            </Col>
            <Col lg={2}>
              <div class="radio">
                <label><input type="radio" name="optradio" checked/>True</label>
              </div>
              <div class="radio">
                <label><input type="radio" name="optradio"/>False</label>
              </div>
            </Col>
        </Row>
        </ListGroupItem>
        )
})
        return (
            <div>
            <ListGroup>
                <Row>
                 <Col lg={10}>
                   Text
                 </Col>
                 <Col lg={2}>
                   Is relevant?
                 </Col>
                </Row>
                {lineTraining}
            </ListGroup>
            </div>
        )
    }
}