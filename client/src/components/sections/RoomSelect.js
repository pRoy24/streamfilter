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
        console.log("HERE");
        let topicOptions = optionList.map(function(item){
            return <option value={item}>{item}</option>
        })
        return (
            <Row className="row-container">
              <Col lg={10}>          
                <div className="row-heading"><i className="fas fa-globe room-icon"></i>Fact-Check</div>
                
              </Col>
              <Col lg={2}>
                <select className="topic-option-select" onChange={this.topicSelected}>{topicOptions}</select>
              </Col>
            </Row>
            )
    }
}