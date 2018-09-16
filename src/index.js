import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './example/App';

console.ident = v => (console.log(v), v);

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
