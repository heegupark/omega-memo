import React from 'react';
import reactCSS from 'reactcss';
import { SliderPicker } from 'react-color';

class ColorPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      displayColorPicker: false,
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1'
      }
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker
    });
  }

  handleClose() {
    this.setState({
      displayColorPicker: false
    });
  }

  handleChange(color) {
    this.setState({
      color: color.rgb
    });
  }

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '14px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`
        },
        swatch: {
          background: '#fff',
          borderRadius: '2px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });
    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker
          ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose} />
              <SliderPicker color={this.state.color} onChange={this.handleChange} />
            </div>
          )
          : null
        }
      </div>
    );
  }
}

export default ColorPicker;
