import React from 'react';
import logo from 'shared/static/logo.svg';
import './App.css';

import Button from '@material-ui/core/Button'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      <Button variant="contained">ok now!</Button>
      </header>

    </div>
  );
}

export default App;
