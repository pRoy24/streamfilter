import React, {Component} from 'react';
import RoomSelect from '../sections/RoomSelect';
import RoomViewSelect from '../sections/RoomViewSelect';
import RoomCurrentFeed from '../sections/RoomCurrentFeed';
import axios from 'axios';
import {Grid} from 'react-bootstrap';

export default class MainFeed extends Component {
    
    constructor(props) {
        super(props);
        this.state = {"currentView": "main", rawLines: []};

        
    }
    
    showResultFeed = () => {
        this.setState({currentView: "main"});
    };
    
    showVotingFeed = () => {
        this.setState({currentView: "voting"});
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {currentView} = this.state;
        const self = this;
        if (prevState.currentView !== currentView) {
            if (currentView === "voting") {
                axios.get("http://34.217.192.198:3011/raw-news-lines").then(function(response){
                    self.setState({rawLines: response.data.data});
                });
            }
        }
    }
    
    
    render() {
        return (
            <Grid>
                <RoomSelect/>
                <RoomViewSelect showResultFeed={this.showResultFeed} showVotingFeed={this.showVotingFeed}/>
                <RoomCurrentFeed rawLines={this.state.rawLines}/>
            </Grid>
            )
    }
}