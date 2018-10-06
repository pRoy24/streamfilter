import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

export default class FactCheckFeed extends Component {
    render() {
        const {rawLines} = this.props;

        let factCheckRows = <span/>;

        if (rawLines.length > 0) {
            factCheckRows = rawLines.map(function(item, idx){
                // Placeholder get random star rating
                let range = Math.floor(Math.random() * 5) + 1;
                let starRating = [];
                for (var i = 0; i< range; i++) {
                    starRating.push(<i className="fa fa-star"/>)
                }
                return (<ListGroupItem>
                <Row>
                  <Col lg={10}><div className="fact-check-sentence-container">{item.sentence}</div></Col>
                  <Col lg={2}>
                    <div><span className="text-sub">Fact Rating </span>{starRating}</div>
                    <div>
                      <span className="text-sub">Publisher</span><span className="item-source"><a href={item.url}>{item.source.name}</a></span>
                    </div>
                  </Col>
                  </Row>
                </ListGroupItem>)
            })
        }
        return (
            <Row className="row-container">
              <Col lg={12} className="current-feed-container">
                <ListGroup>
                    {factCheckRows}
                </ListGroup>    
              </Col>    
            </Row>
            )
    }
}