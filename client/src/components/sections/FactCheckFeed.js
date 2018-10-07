import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import { DrizzleContext } from "drizzle-react";

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
                    <RatedRows {...this.props}/>
                </ListGroup>    
              </Col>    
            </Row>
            )
    }
}

class RatedRows extends Component {
  render() {
    return (
      <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
  
      if (!initialized) {
        return <i className="fa fa-spinner fa-spin"/>;
      }

      return (
        <RowItemList drizzle={drizzle} drizzleState={drizzleState} {...this.props}/>
      );
    }}
  </DrizzleContext.Consumer>
      )
  }
}


class RowItemList extends Component {

  render() {
        const {rawLines, drizzleState, drizzle} = this.props;

        let factCheckRows = <span/>;

        if (rawLines.length > 0) {
            factCheckRows = rawLines.map(function(item, idx){
                // Placeholder get random star rating
                let range = Math.floor(Math.random() * 5) + 1;
                let starRating = [];
                for (var i = 0; i< range; i++) {
                    starRating.push(<i className="fa fa-star"/>)
                }
                return (<RowItem item={item} drizzleState={drizzleState} drizzle={drizzle} key={item.contentID}/>)
            })
        }
        return (
          <div>{factCheckRows}</div>
          )
  }
}

class RowItem extends Component {
  constructor(props) {
    super(props);
    this.state = {"ratingKey" : ""}
  }
    componentDidMount() {
              const { drizzle, drizzleState, item } = this.props;
                      const contract = drizzle.contracts.BallotableContents;
          const ratingKey = contract.methods["getAccuracyScore"].cacheCall(item.contentID);
         this.setState({ratingKey});
         //console.log(item.contentID);
          // console.log(rating);
          // console.log(drizzle);
          // console.log(drizzleState);
  }
  render() {
    const {item} = this.props;
    const { BallotableContents } = this.props.drizzleState.contracts;
    let rating = 0;
    if (this.state.ratingKey) {
     rating = BallotableContents.getAccuracyScore[this.state.ratingKey];
      console.log(rating);
    }
   // console.log(rating, this.props, BallotableContents);
    
    return (
        <ListGroupItem>
          <Row>
            <Col lg={10}><div className="fact-check-sentence-container">{item.sentence}</div></Col>
              <Col lg={2}>
                <div><span className="text-sub">Fact Rating </span>{rating ? rating.value : 0}</div>
                  <div>
                      <span className="text-sub">Publisher</span><span className="item-source"><a href={item.url}>{item.source.name}</a></span>
                  </div>
                </Col>
              </Row>
            </ListGroupItem>
      )
  }
}