import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="row mx-auto bg-transparent fixed-top">
        <div className="col my-auto text-center logo-box">
          <img className="omega-logo mr-1 mb-1" src="images/o-logo.png" />
          <div className="navbar-brand text-white mx-auto omega-note hover-blue">pin</div>
          <span className="badge badge-warning ml-1">beta</span>
        </div>
      </header>
    );
  }
}

export default Header;
