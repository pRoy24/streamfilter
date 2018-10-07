import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import './sections.css';
const optionList =["ethereum", "technology", "tesla", "leagueoflegends"]
export default class RoomSelect extends Component {
    constructor(props) {
        super(props);
        this.topicSelected = this.topicSelected.bind(this);
    }
    
    topicSelected(evt) {
        let selectedOption = evt.target.value;
        this.props.changeSelectedTopic(selectedOption);
    }
    
    render() {
        let topicOptions = optionList.map(function(item){
            return <option value={item}>{item}</option>
        })
        return (
            <Row className="row-container">
              <Col xs={6} lg={9}>          
                <div className="row-heading"><i className="fas fa-globe room-icon"></i>Fact-Check</div>
                
              </Col>
              <Col xs={6} lg={3}>
                <select className="topic-option-select" onChange={this.topicSelected}>{topicOptions}</select>
              </Col>
            </Row>
            )
    }
}