import React, { Component } from 'react';
import Pin from './pin';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class App extends Component {
  constructor() {
    super();
    this.state = {
      pins: []
    };
    this.getPins = this.getPins.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
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

  render() {
    const { pins } = this.state;
    const { handleBoardClick, updatePin, deletePin } = this;
    return (
      <>
        <div
          className="mx-auto bg-dark pin-board cursor"
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
        </div>
      </>
    );
  }
}

export default App;
