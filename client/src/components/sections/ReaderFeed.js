import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import { DrizzleContext } from "drizzle-react";

export default class ReadersFeed extends Component {
    render() {
        return (
      <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
  
      if (!initialized) {
        return <i className="fa fa-spinner fa-spin"/>;
      }

      return (
        <ReadersFeedApp drizzle={drizzle} drizzleState={drizzleState} {...this.props}/>
      );
    }}
  </DrizzleContext.Consumer>
            
            )
    }
}

class ReadersFeedApp extends Component {
    
    componentDidMount() {
        console.log(this.props);
        const {rawLines, drizzle} = this.props;
        const contract = drizzle.contracts.BallotableContents;

    }
    render() {
        const {drizzle, drizzleState, rawLines} = this.props;
        let rowMap = rawLines.map(function(item, idx){
            return <ItemRow drizzle={drizzle} drizzleState={drizzleState} item={item}/>
        })
        return (
            <div>{rowMap}</div>
            
        )
    }
}

class ItemRow extends Component {
    constructor(props) {
        super(props);
        this.state = {dataKey: ""}
    }
    
    componentDidMount() {
        const { drizzle,item , drizzleState } = this.props;
        const contract = drizzle.contracts.BallotableContents;
        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getAccuracyScore"].cacheCall(item.contentID);
        // save the `dataKey` to local component state for later reference
        this.setState({ dataKey });
    }
    
    render() {
        const {item, drizzle, drizzleState} = this.props;

        
        const { BallotableContents } =  this.props.drizzleState.contracts;
        let accuracyScore = null;
        if (this.state.dataKey) { 
            accuracyScore = BallotableContents.getAccuracyScore[this.state.dataKey];
        }
        let starRating = [];

        if (accuracyScore && accuracyScore.value) {
            accuracyScore = accuracyScore.value;
        } else {
            accuracyScore = 0;
        }
        for (var i = 0; i < accuracyScore; i++) {
           starRating.push(<i className="fa fa-star"/>) 
        }
        return (
            <div>
                <ListGroupItem>
                <Row>
                    <Col lg={10}><div className="fact-check-sentence-container">{item.sentence}</div></Col>
                    <Col lg={2}>
                        <div>
                            <span className="text-sub">Rating</span>{starRating}
                        </div>
                        <div>
                          <span className="item-source"><a href={item.url}>{item.source.name}</a></span>
                        </div>
                    </Col>
                 </Row>
                </ListGroupItem>
            </div>
        )
    }
}