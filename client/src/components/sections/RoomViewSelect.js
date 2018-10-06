import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import './sections.css';


export default class RoomViewSelect extends Component {
    render() {
        return (
            <Row className="row-container">
                <Col xs={3} lg={1} className="nav-menu no-pad" onClick={this.props.showResultFeed}>
                  Feed
                </Col>
                <Col xs={3} lg={1}  className="nav-menu no-pad" onClick={this.props.showVotingFeed}>
                  Vote
                </Col>
                <Col xs={3} lg={1}  className="nav-menu no-pad" >
                  Exchange
                </Col>
                <Col xs={3} lg={1} className="nav-menu" >
                  Profile
                </Col>
            </Row>
            )
    }
}