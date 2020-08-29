import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Home from './Home';
import logo from './logo.png';
import linkedin from './linkedin.png';
import github from './github.png';
import './App.css';

const NotFound = () => {
  return <h2 className="p-3">404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-light bg-light header">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="logo" />
          &nbsp;ChangeHK
        </Link>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
      <nav className="navbar navbar-light bg-light footer justify-content-center">
        © 2020 Created by William Chan&nbsp;&nbsp;
        <a class="navbar-brand" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/thewilliamchan"><img src={linkedin} height="30" alt="linkedin"/></a>
        <a class="navbar-brand" target="_blank" rel="noopener noreferrer" href="https://github.com/thewilliamchan"><img src={github} height="30" alt="github"/></a>
      </nav>
    </Router>
  );
}

export default App;
