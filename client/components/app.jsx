import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Main from './main';
import { v4 as uuidv4 } from 'uuid';

class App extends Component {
  render() {
    const board = window.location.pathname.split('/')[1] || uuidv4();
    return (
      <>
        <Header />
        <Router>
          <Route path='/' component={() => <Main board={board} />} />
          <Redirect to={`/${board}`} />
        </Router>
        <Footer />
      </>
    );
  }
}

export default App;
