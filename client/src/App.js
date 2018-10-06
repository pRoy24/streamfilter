import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TopNav from './components/nav/TopNav';
import MainFeed from './components/main/MainFeed';
import Trainer from './components/train/Trainer';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNav/>
        <div>
        <Router>
          <div>
            <Route exact path="/" component={MainFeed}/>
            <Route path="/about" component={MainFeed}/>
            <Route path="/train" component={Trainer}/>
          </div>
        </Router>
        </div>
      </div>
    );
  }
}

export default App;
