import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { BlockPicker } from 'react-color';
import IconButton from '@material-ui/core/IconButton';
import PaletteIcon from '@material-ui/icons/Palette';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  popper: {
    padding: theme.spacing(2)
  }
}));

export default function PopperComponent(props) {
  const isBg = props.category === 'bg';
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(props.color);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  const handleChangeComplete = (color, event) => {
    setValue(color.hex);
    if (isBg) {
      props.setBackgroundColor(color.hex);
    } else {
      props.setTextColor(color.hex);
    }
  };

  return (
    <>
      <Tooltip
        arrow
        className='mx-2'
        title={isBg ? 'color this memo' : 'color your text'}>
        <IconButton
          aria-describedby={id}
          color='secondary'
          className="my-auto"
          size="small"
          aria-label={isBg ? 'color this memo' : 'color your text'}
          onClick={handleClick}
        >{isBg
            ? <PaletteIcon
              style={{ color: props.revColor }}/>
            : <TextFieldsIcon
              style={{ color: props.textColor }}
            />}
        </IconButton>
      </Tooltip>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        className={classes.popper}
        modifiers={{
          preventOverflow: {
            enabled: true
          }
        }}
        transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
            <BlockPicker
              color={props.color}
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
