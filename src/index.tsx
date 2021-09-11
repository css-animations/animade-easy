import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {CanvasComponent} from "./components/Canvas";

ReactDOM.render(
    <React.StrictMode>
      <CanvasComponent  width="600px" height="400px" style={{border: "1px solid black", margin: 5, borderRadius: 10}}/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
