import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import './sections.css';
export default class RoomSelect extends Component {
    render() {
        return (
            <Row className="row-container">
              <Col lg={12}>          
                <div className="row-heading"><i className="fas fa-globe room-icon"></i>Fact-Check Ethereum</div>
              </Col>
            </Row>
            )
    }
}