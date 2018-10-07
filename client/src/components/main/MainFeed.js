import React, {Component} from 'react';
import RoomSelect from '../sections/RoomSelect';
import RoomViewSelect from '../sections/RoomViewSelect';
import RoomCurrentFeed from '../sections/RoomCurrentFeed';
import ReaderFeed from '../sections/ReaderFeed';
import axios from 'axios';
import {Grid} from 'react-bootstrap';

export default class MainFeed extends Component {
    
    constructor(props) {
        super(props);
        this.state = {"currentView": "main", rawLines: [], "currentTopic": "ethereum"};
        this.changeSelectedTopic = this.changeSelectedTopic.bind(this);
    }
    
   changeSelectedTopic(value) {
       console.log(value);
       console.log("IIU")
       this.setState({currentTopic: value});
   } 
    
    showResultFeed = () => {
        this.setState({currentView: "main"});
    };
    
    showVotingFeed = () => {
        this.setState({currentView: "voting"});
    }
    
    componentWillMount() {
        const self = this;
        axios.get(`http://34.220.70.126:3011/raw-news-lines?q=${this.state.currentTopic}`).then(function(response){
            self.setState({rawLines: response.data.data});
        });
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {currentView} = this.state;
        const self = this;
        if (prevState.currentView !== currentView || prevState.currentTopic !== this.state.currentTopic) {
            if (currentView === "voting") {
                axios.get(`http://34.220.70.126:3011/raw-news-lines?q=${this.state.currentTopic}`).then(function(response){
                    self.setState({rawLines: response.data.data});
                });
            }
            // TODO change this when final view ready
             if (currentView === "main") {
                axios.get(`http://34.220.70.126:3011/raw-news-lines?q=${this.state.currentTopic}`).then(function(response){
                    self.setState({rawLines: response.data.data});
              });
            }   
        }
    }
    
    
    render() {
        let currentFeed = <span/>;
        if (this.state.currentView === "voting") {
            currentFeed = <RoomCurrentFeed rawLines={this.state.rawLines}/>
        } else if (this.state.currentView === "main") {
            currentFeed = <ReaderFeed rawLines={this.state.rawLines}/>
        }
        return (
            <Grid>
                <RoomSelect changeSelectedTopic={this.changeSelectedTopic}/>
                <RoomViewSelect showResultFeed={this.showResultFeed} showVotingFeed={this.showVotingFeed}/>
                {currentFeed}
            </Grid>
            )
    }
}