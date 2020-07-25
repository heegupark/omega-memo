import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Header from './header';
import Footer from './footer';
import Disclaimer from './disclaimer';
import Pin from './pin';
import PinMobile from './pin-mobile';
import { isMobile } from 'react-device-detect';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class App extends Component {
  constructor() {
    super();
    this.state = {
      pins: [],
      isDisclaimerAccepted: localStorage.getItem('omegapinaccept')
    };
    this.getPins = this.getPins.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleDisclaimerAccept = this.handleDisclaimerAccept.bind(this);
    this.updatePin = this.updatePin.bind(this);
    this.deletePin = this.deletePin.bind(this);
  }

  componentDidMount() {
    this.getPins();
    socket.on('pins', data => {
      if (data.status === 'add') {
        this.setState({
          pins: [...this.state.pins, data.data]
        });
      } else if (data.status === 'delete') {
        this.setState({
          pins: this.state.pins.filter(pin => pin._id !== data.data._id)
        });
      } else if (data.status === 'update') {
        this.setState({
          pins: this.state.pins.map(pin => {
            return pin._id.toString() === data.data._id.toString() ? data.data : pin;
          })
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
    };
    socket.emit('disconnect');
  }

  getPins() {
    fetch('/api/pin')
      .then(res => res.json())
      .then(result => {
        this.setState({
          pins: result.data
        });
      })
      .catch(err => {
        console.error(`Something wrong happened when getting pins:${err.message}`);
      });
  }

  handleBoardClick(e) {
    const pin = {
      positionX: e.clientX,
      positionY: e.clientY,
      memo: ''
    };
    if (e.target === e.currentTarget) {
      fetch('/api/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pin)
      })
        .then(res => res.json())
        .then(result => {
          // this.setState({
          //   pins: [...this.state.pins, result.data]
          // });
        })
        .catch(err => {
          console.error(`Something wrong happened when creating a pin:${err.message}`);
        });
    }
  }

  updatePin(updatedPin) {
    fetch('/api/pin', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPin)
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          pins: this.state.pins.map(pin => {
            return pin._id.toString() === updatedPin._id.toString() ? updatedPin : pin;
          })
        });
      })
      .catch(err => {
        console.error(`Something wrong happened when patching a pin:${err.message}`);
      });
  }

  deletePin(id) {
    fetch('/api/pin', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: id })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({
            pins: this.state.pins.filter(pin => {
              return pin._id.toString() !== id.toString();
            })
          });
        }
      })
      .catch(err => {
        console.error(`Something wrong happened when deleting a pin:${err.message}`);
      });
  }

  handleDisclaimerAccept(accept) {
    this.setState({
      isDisclaimerAccepted: accept
    });
  }

  render() {
    const { pins, isDisclaimerAccepted } = this.state;
    const { handleBoardClick, handleDisclaimerAccept, updatePin, deletePin } = this;
    if (isMobile) {
      return (
        <>
          <Header />
          {isDisclaimerAccepted
            ? (
              <main
                className="bg-dark pin-board py-5">
                <Grid container>
                  <Grid item xs>
                    <Grid container justify="center">
                      {pins
                        ? (
                          pins.map(pin => {
                            return (
                              <PinMobile
                                key={pin._id}
                                pin={pin}
                                updatePin={updatePin}
                                deletePin={deletePin}
                              />
                            );
                          })
                        )
                        : ''
                      }
                      <div className="mt-3 mx-2">
                        <div
                          style={{ height: '246px' }}
                          className="bg-transparent pin rounded position-relative text-center"
                        >
                          <div
                            style={{ fontSize: '55px', color: 'white' }}
                            className="mt-5" onClick={handleBoardClick}>
                            {'+'}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </main>
            )
            : (
              <Disclaimer
                isMobile={isMobile}
                handleDisclaimerAccept={handleDisclaimerAccept} />
            )
          }
          <Footer />
        </>
      );
    }
    return (
      <>
        <Header />
        {isDisclaimerAccepted
          ? (
            <main
              className="bg-dark pin-board cursor py-3"
              onMouseDown={handleBoardClick}>
              {pins
                ? (
                  pins.map(pin => {
                    return (
                      <Pin
                        key={pin._id}
                        pin={pin}
                        updatePin={updatePin}
                        deletePin={deletePin}
                      />
                    );
                  })
                )
                : ''
              }
            </main>
          )
          : (
            <Disclaimer
              isMobile={isMobile}
              handleDisclaimerAccept={handleDisclaimerAccept} />
          )
        }
        <Footer />
      </>
    );
  }
}

export default App;
