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
                <Col xs={3} lg={1}  className="nav-menu no-pad" onClick={this.props.showMarketFeed}>
                  Exchange
                </Col>
                <Col xs={3} lg={1} className="nav-menu" >
                  Profile
                </Col>
                <Col xs={4} lg={2} lgOffset={6}>
                   <i className="fas fa-caret-left arrow-icon"/>&nbsp;
                      <div className="page-no-label"><span>Page 1</span></div>&nbsp;
                   <i className="fas fa-caret-right arrow-icon"/>
                </Col>
            </Row>
            )
    }
}

