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
            web3Contract: new web3.eth.Contract(BallotableContents.abi, "0x92373d7cF03F0b126A48be53B919F26d5b9F927F")
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
