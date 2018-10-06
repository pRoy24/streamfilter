import React, {Component} from 'react';
import {Row, Col, ListGroup, ListGroupItem, ToggleButton, ToggleButtonGroup, Button} from 'react-bootstrap';
import './sections.css';
import { DrizzleContext } from "drizzle-react";

export default class RoomCurrentFeed extends Component {
    render() {
        const {rawLines} = this.props;
        return (
            <Row className="row-container">
              <Col lg={12} className="current-feed-container">
                    <DrizzleContainer {...this.props}/>
              </Col>    
            </Row>
            )
    }
}

class DrizzleContainer extends Component {
    render() {
        return (
              <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
  
      if (!initialized) {
        return "Loading...";
      }

      return (
        <CurrentFeedView drizzle={drizzle} drizzleState={drizzleState} {...this.props}/>
      );
    }}
  </DrizzleContext.Consumer>
  
            )
    }
}

class CurrentFeedView extends Component {
    constructor(props) {
        super(props);
 
    }

    render() {
        const self = this;
        const {rawLines, drizzleState, drizzle} = this.props;
        let lineTraining = rawLines.map(function(item){
            return (
                <LineItemGrader item={item} drizzleState={drizzleState} drizzle={drizzle}/>
            )
        });
        return (
            <ListGroup>
                {lineTraining}
            </ListGroup>
        )
    }
}

class LineItemGrader extends Component {
    constructor(props) {
        super(props);
        this.state = {relevanceValue: -1,accuracyValue: -1 }
        this.submitVote = this.submitVote.bind(this);
    }
    
    updateValue(type, value) {
        let obj = {};
        obj[type] = value;
        this.setState(obj);
    }

    submitVote() {
        const { drizzle, drizzleState } = this.props;
        console.log(this.props);
        const {accuracyValue, relevanceValue} = this.state;
        const contract = drizzle.contracts.BallotableContents;

        const stackId = contract.methods["ballot"].cacheSend(accuracyValue, relevanceValue, 3, 4, {
            from: drizzleState.accounts[0], value: 1000000000000000000

        });
    }
    
    render() {
        const self = this;
        const {item} = this.props;
        return (
                    <ListGroupItem>
        <Row>
            <Col lg={10} style={{"float": "left", "textAlign":"left"}}>
              {item.sentence}
            </Col>
            <Col lg={2}>
            <div>Accuracy</div>
            <ToggleButtonGroup bsSize="small"
                type="radio" name="accuracyVote"
                value={self.state.accuracyValue}
                onChange={self.updateValue.bind(self, "accuracyValue")}>
                <ToggleButton value={1}>1</ToggleButton>
                <ToggleButton value={2}>2</ToggleButton>
                <ToggleButton value={3}>3</ToggleButton>
                <ToggleButton value={4} >4</ToggleButton>
                <ToggleButton value={5} >5</ToggleButton>
            </ToggleButtonGroup>
            <div>Relevance</div>
            <ToggleButtonGroup bsSize="small"
                type="radio" name="relevanceVote"
                value={self.state.relevanceValue}
                onChange={self.updateValue.bind(self, "relevanceValue")}
              >
                <ToggleButton value={1}>1</ToggleButton>
                <ToggleButton value={2}>2</ToggleButton>
                <ToggleButton value={3}>3</ToggleButton>
                <ToggleButton value={4} >4</ToggleButton>
                <ToggleButton value={5} >5</ToggleButton>
            </ToggleButtonGroup>
                <Button className="vote-submit-button" onClick={self.submitVote}>Submit</Button>
            </Col>
        </Row>
        </ListGroupItem>
            )
    }
}