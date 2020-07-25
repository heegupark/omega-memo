import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    width: '50%',
    textAlign: 'center',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  paperForMobile: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    width: '80%',
    fontSize: '12px',
    textAlign: 'center',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 2, 1)
  }
}));

export default function Disclaimer(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleOpen();
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAcceptClick = () => {
    localStorage.setItem('omegapinaccept', true);
    props.handleDisclaimerAccept(true);
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={props.isMobile ? classes.paperForMobile : classes.paper}>
            <p className="mx-auto my-2 h5">Welcome to Omega Pin</p>
            <div className="mx-3 my-2 text-center">This app is created strictly for demonstration purposes. By clicking the button below, you accept that Omega Pin do not guarantee storing the memos that you write.</div>
            <button className="btn btn-sm btn-danger mx-auto my-2" onClick={handleAcceptClick}>Accept</button>
            <p className="mx-auto my-2 text-warning text-center">This application is in-progress. I built this app using React, Node.js, Material UI, socker.io, and MongoDB to provide a function for users to play with memos.</p>
            <div className="mx-3 my-2 text-center text-secondary">{'If you have any questions, please email to '}<a href="mailto:omegathrone@omegathrone.com">omegathrone@omegathrone.com</a>.</div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
