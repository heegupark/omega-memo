import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Button, TextareaAutosize } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeleteIcon from '@material-ui/icons/Delete';
import socketIOClient from 'socket.io-client';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import ColorPicker from './color-picker';

const socket = socketIOClient('/');

class Pin extends Component {
  constructor() {
    super();
    this.state = {
      isDelete: false,
      isLocked: false,
      positionX: null,
      positionY: null,
      memo: ''
    };
    this.handleUnlockBtnClick = this.handleUnlockBtnClick.bind(this);
    this.handleLockBtnClick = this.handleLockBtnClick.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleDelBtnToggle = this.handleDelBtnToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changePin = this.changePin.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.idRef = React.createRef();
    this.positionRef = React.createRef();
  }

  componentDidMount() {
    const { ...rest } = this.props.pin;
    if (this.props.pin) {
      this.setState({
        ...rest
      });
    }
    socket.on(`pin-${this.props.pin._id}`, data => {
      const { ...rest } = data.data;
      this.setState({
        ...rest
      });
    });
  }

  handleLockBtnClick(e) {
    e.preventDefault();
    this.setState({
      isLocked: true
    });
    this.changePin(true);
  }

  handleUnlockBtnClick(e) {
    e.preventDefault();
    this.setState({
      isLocked: false
    });
    this.changePin(false);
  }

  handleChangeInput(e) {
    e.preventDefault();
    this.setState({
      memo: e.target.value
    });
  }

  handleDelBtnToggle(e) {
    e.preventDefault();
    this.setState({
      isDelete: !this.state.isDelete
    });
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.deletePin(this.idRef.current.id);
  }

  changePin(isLocked) {
    const currentPosX = this.positionRef.current.state.x;
    const currentPosY = this.positionRef.current.state.y;
    const pin = {
      _id: this.props.pin._id,
      positionX: currentPosX,
      positionY: currentPosY,
      memo: this.state.memo,
      isLocked
    };
    this.props.updatePin(pin);
  }

  handleChange(e) {
    e.preventDefault();
    const currentPosX = this.positionRef.current.state.x;
    const currentPosY = this.positionRef.current.state.y;
    this.setState({
      positionX: this.positionRef.current.state.x,
      positionY: this.positionRef.current.state.y
    });
    if (currentPosX !== this.props.pin.positionX && currentPosY !== this.props.pin.positioY) {
      this.changePin();
    }
  }

  render() {
    const { pin } = this.props;
    const { memo, isDelete, isLocked, positionX, positionY } = this.state;
    const { idRef, positionRef, handleDelete, handleUnlockBtnClick, handleLockBtnClick, handleChangeInput, handleDelBtnToggle, handleChange } = this;
    return (
      <>
        <Draggable
          handle=".handle"
          ref={positionRef}
          position={{
            x: positionX,
            y: positionY
          }}
          grid={[5, 5]}
          scale={1}
          disabled={!isLocked}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={handleChange}>
          <Card className="pin handle rounded position-absolute">
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={8}
              disabled={isLocked || isDelete}
              className="w-100 border-0 px-1 resize-none"
              placeholder="memo here"
              value={memo || ''}
              onChange={handleChangeInput} />
            {isDelete
              ? (
                <>
                  <Fade in={true}>
                    <div className="position-absolute card-btn-custom">
                      <div className="w-100 text-center my-4 mx-auto">
                        <Tooltip arrow title='delete this card?'>
                          <Button
                            ref={idRef}
                            id={pin._id}
                            variant="contained"
                            component="span"
                            color='secondary'
                            className="my-auto"
                            size="small"
                            aria-label='lock this memo'
                            onClick={handleDelete}
                          >delete
                          </Button>
                        </Tooltip>
                      </div>
                      <div className="w-100 text-center my-4 mx-auto">
                        <Tooltip arrow title='cancel to delete this card?'>
                          <Button
                            ref={idRef}
                            id={pin._id}
                            variant="contained"
                            component="span"
                            color='default'
                            className="my-auto"
                            size="small"
                            aria-label='cancel to delete'
                            onClick={handleDelBtnToggle}
                          >cancel
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </Fade>
                  <div className="w-100 text-center h-32"></div>
                </>
              )
              : (
                <Fade in={true}>
                  <div className="w-100 text-center h-32">
                    <Tooltip
                      style={{ display: `${isLocked ? 'none' : ''}` }}
                      arrow title='delete'>
                      <Button
                        ref={idRef}
                        id={pin._id}
                        component="span"
                        color='secondary'
                        className="my-auto"
                        size="small"
                        aria-label='lock this memo'
                        onClick={handleDelBtnToggle}
                      ><DeleteIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip arrow title={isLocked ? 'unlock' : 'lock'}>
                      <Button
                        id={pin.id}
                        component="span"
                        color={isLocked ? 'default' : 'primary'}
                        className="my-auto"
                        size="small"
                        aria-label={isLocked ? 'unlock this memo' : 'lock this memo'}
                        onClick={isLocked ? handleUnlockBtnClick : handleLockBtnClick}
                      >{isLocked ? <LockOpenIcon /> : <LockIcon />}
                      </Button>
                    </Tooltip>
                    <Tooltip arrow title='change color'>
                      <ColorPicker
                      />
                    </Tooltip>
                  </div>
                </Fade>
              )
            }
          </Card>
        </Draggable>
      </>
    );
  }
}

export default Pin;
