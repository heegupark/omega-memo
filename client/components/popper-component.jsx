import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { BlockPicker } from 'react-color';
import IconButton from '@material-ui/core/IconButton';
import PaletteIcon from '@material-ui/icons/Palette';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  popper: {
    padding: theme.spacing(2)
  }
}));

export default function PopperComponent(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(props.color);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  const handleChangeComplete = (color, event) => {
    setValue(color.hex);
    props.setBackgroundColor(color.hex);
    // setAnchorEl(null);
  };

  const handlePopperClose = event => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip
        arrow
        className='mx-2'
        title='color this memo'>
        <IconButton
          aria-describedby={id}
          color='secondary'
          className="my-auto"
          size="small"
          aria-label='color this memo'
          onClick={handleClick}
        ><PaletteIcon />
        </IconButton>
      </Tooltip>
      <Popper
        id={id}
        open={open}
        onBlur={handlePopperClose}
        anchorEl={anchorEl}
        className={classes.popper}
        transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
            <BlockPicker
              color={value}
              value={value}
              onChange={({ hex }) => {
                setValue(hex);
              }}
              onChangeComplete={handleChangeComplete}
            />
          </Fade>
        )}
      </Popper>
    </>
  );
}
