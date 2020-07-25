import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Header from './header';
import Footer from './footer';
import Disclaimer from './disclaimer';
import Memo from './memo';
import MemoMobile from './memo-mobile';
import { isMobile } from 'react-device-detect';
import socketIOClient from 'socket.io-client';
const socket = socketIOClient('/');

class App extends Component {
  constructor() {
    super();
    this.state = {
      memos: [],
      isDisclaimerAccepted: localStorage.getItem('omegamemoaccept')
    };
    this.getMemos = this.getMemos.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.handleDisclaimerAccept = this.handleDisclaimerAccept.bind(this);
    this.updateMemo = this.updateMemo.bind(this);
    this.deleteMemo = this.deleteMemo.bind(this);
    this.reverseColor = this.reverseColor.bind(this);
  }

  componentDidMount() {
    this.getMemos();
    socket.on('memos', data => {
      if (data.status === 'add') {
        this.setState({
          memos: [...this.state.memos, data.data]
        });
      } else if (data.status === 'delete') {
        this.setState({
          memos: this.state.memos.filter(memo => memo._id !== data.data._id)
        });
      } else if (data.status === 'update') {
        this.setState({
          memos: this.state.memos.map(memo => {
            return memo._id.toString() === data.data._id.toString() ? data.data : memo;
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

  getMemos() {
    fetch('/api/memo')
      .then(res => res.json())
      .then(result => {
        this.setState({
          memos: result.data
        });
      })
      .catch(err => {
        console.error(`Something wrong happened when getting memos:${err.message}`);
      });
  }

  handleBoardClick(e) {
    const memo = {
      positionX: e.clientX,
      positionY: e.clientY,
      memo: ''
    };
    if (e.target === e.currentTarget) {
      fetch('/api/memo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memo)
      })
        .then(res => res.json())
        .then(result => {
          // this.setState({
          //   memos: [...this.state.memos, result.data]
          // });
        })
        .catch(err => {
          console.error(`Something wrong happened when creating a memo:${err.message}`);
        });
    }
  }

  updateMemo(updatedMemo) {
    fetch('/api/memo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedMemo)
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          memos: this.state.memos.map(memo => {
            return memo._id.toString() === updatedMemo._id.toString() ? updatedMemo : memo;
          })
        });
      })
      .catch(err => {
        console.error(`Something wrong happened when patching a memo:${err.message}`);
      });
  }

  deleteMemo(id) {
    fetch('/api/memo', {
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
            memos: this.state.memos.filter(memo => {
              return memo._id.toString() !== id.toString();
            })
          });
        }
      })
      .catch(err => {
        console.error(`Something wrong happened when deleting a memo:${err.message}`);
      });
  }

  handleDisclaimerAccept(accept) {
    this.setState({
      isDisclaimerAccepted: accept
    });
  }

  reverseColor(color) {
    return '#' + ('000000' + (0xFFFFFF ^ parseInt(color.substring(1), 16)).toString(16)).slice(-6);
  }

  render() {
    const { memos, isDisclaimerAccepted } = this.state;
    const { handleBoardClick, handleDisclaimerAccept, updateMemo, deleteMemo, reverseColor } = this;
    if (isMobile) {
      return (
        <>
          <Header />
          {isDisclaimerAccepted
            ? (
              <main
                className="bg-dark memo-board py-5">
                <Grid container>
                  <Grid item xs>
                    <Grid container justify="center">
                      {memos
                        ? (
                          memos.map(memo => {
                            return (
                              <MemoMobile
                                key={memo._id}
                                memo={memo}
                                updateMemo={updateMemo}
                                deleteMemo={deleteMemo}
                                reverseColor={reverseColor}
                              />
                            );
                          })
                        )
                        : ''
                      }
                      <div className="mt-3 mx-2">
                        <div
                          style={{ height: '246px' }}
                          className="bg-transparent memo rounded position-relative text-center"
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
              className="bg-dark memo-board cursor py-3"
              onMouseDown={handleBoardClick}>
              {memos
                ? (
                  memos.map(memo => {
                    return (
                      <Memo
                        key={memo._id}
                        memo={memo}
                        updateMemo={updateMemo}
                        deleteMemo={deleteMemo}
                        reverseColor={reverseColor}
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
