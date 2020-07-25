import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Button, TextareaAutosize } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import socketIOClient from 'socket.io-client';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import PopperComponent from './popper-component';

const socket = socketIOClient('/');

class Pin extends Component {
  constructor() {
    super();
    this.state = {
      isDelete: false,
      isLocked: false,
      positionX: null,
      positionY: null,
      memo: '',
      isPallete: false,
      color: '#ffffff',
      textColor: '#000000'
    };
    this.setTextColor = this.setTextColor.bind(this);
    this.setBackgroundColor = this.setBackgroundColor.bind(this);
    this.handleUnlockBtnClick = this.handleUnlockBtnClick.bind(this);
    this.handleLockBtnClick = this.handleLockBtnClick.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleDelBtnToggle = this.handleDelBtnToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changePin = this.changePin.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.reverseColor = this.reverseColor.bind(this);
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
    this.props.deletePin(this.props.pin._id);
  }

  setBackgroundColor(color) {
    this.setState({ color });
    this.changePin();
  }

  setTextColor(textColor) {
    this.setState({ textColor });
    this.changePin();
  }

  changePin(isLocked) {
    const currentPosX = this.positionRef.current.state.x;
    const currentPosY = this.positionRef.current.state.y;
    const pin = {
      _id: this.props.pin._id,
      positionX: currentPosX,
      positionY: currentPosY,
      memo: this.state.memo,
      color: this.state.color,
      textColor: this.state.textColor,
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

  reverseColor(color) {
    return '#' + ('000000' + (0xFFFFFF ^ parseInt(color.substring(1), 16)).toString(16)).slice(-6);
  }

  render() {
    const { memo, isDelete, isLocked, positionX, positionY, color, textColor } = this.state;
    const {
      idRef,
      positionRef,
      handleDelete,
      handleUnlockBtnClick,
      handleLockBtnClick,
      handleChangeInput,
      handleDelBtnToggle,
      setBackgroundColor,
      setTextColor,
      reverseColor,
      handleChange
    } = this;
    const revColor = reverseColor(color);
    return (
      <div>
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
          <Card
            style={{ backgroundColor: `${color}` }}
            className="pin handle rounded position-absolute text-center">
            <div className="w-100 text-center h-30">
              {isDelete
                ? ('')
                : (
                  <Tooltip
                    arrow
                    title={isLocked ? 'unlock' : 'lock'}>
                    <IconButton
                      color='primary'
                      className="my-auto cursor"
                      size="small"
                      style={{ color: revColor }}
                      aria-label={isLocked ? 'unlock this memo' : 'lock this memo'}
                      onClick={isLocked ? handleUnlockBtnClick : handleLockBtnClick}
                    >{isLocked ? <LockOpenIcon /> : <LockIcon />}
                    </IconButton>
                  </Tooltip>
                )
              }
            </div>
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={8}
              style={{ color: `${textColor}` }}
              readOnly={isLocked || isDelete}
              className="w-100 bg-transparent border-0 px-2 py-2 resize-none"
              placeholder="memo here"
              value={memo || ''}
              onChange={handleChangeInput} />
            {isDelete
              ? (
                <>
                  <Fade in={true}>
                    <div
                      className="position-absolute w-100 h-100 card-btn-custom ">
                      <div className="w-100 text-center mt-5 mx-auto">
                        <Tooltip arrow title='delete this card?'>
                          <Button
                            ref={idRef}
                            variant="contained"
                            color='secondary'
                            className="my-auto"
                            size="small"
                            aria-label='delete this memo'
                            onClick={handleDelete}
                          >delete
                          </Button>
                        </Tooltip>
                      </div>
                      <div className="w-100 text-center my-4 mx-auto">
                        <Tooltip arrow title='cancel to delete this card?'>
                          <Button
                            variant="contained"
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
                  <div className="w-100 text-center h-30"></div>
                </>
              )
              : (
                <Fade in={true}>
                  <div className="text-center h-30">
                    {isLocked
                      ? ('')
                      : (
                        <>
                          <PopperComponent
                            color={color}
                            revColor={revColor}
                            category="bg"
                            setBackgroundColor={setBackgroundColor}
                          />
                          <PopperComponent
                            color={textColor}
                            textColor={textColor}
                            category="text"
                            setTextColor={setTextColor}
                          />
                          <Tooltip
                            arrow
                            className='mx-2'
                            title='delete this memo'>
                            <IconButton
                              style={{ color: revColor }}
                              className="my-auto"
                              size="small"
                              aria-label='delete this memo'
                              onClick={handleDelBtnToggle}
                            ><DeleteOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )
                    }
                  </div>
                </Fade>
              )
            }
          </Card>
        </Draggable>
      </div>
    );
  }
}

export default Pin;
