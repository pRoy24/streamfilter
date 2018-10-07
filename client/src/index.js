import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import Web3 from 'web3';
import BallotableContents from "./contracts/BallotableContents.json";

// 2. Setup the drizzle instance.
const web3 = new Web3(Web3.givenProvider);
const options = { 
    contracts: [
        {
            contractName: 'BallotableContents',
            web3Contract: new web3.eth.Contract(BallotableContents.abi, "0xf7291d171cb84557cc292600e1fd157415b476d6")
         }
    ] 
};
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);


ReactDOM.render(<DrizzleContext.Provider drizzle={drizzle}>
<App /></DrizzleContext.Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();