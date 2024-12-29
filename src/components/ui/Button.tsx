import '../../style/App.css';
import '../../style/ui/Button.css';
import React from 'react';
import PropTypes from 'prop-types';

type TextAlign =
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'initial'
  | 'inherit';

type ButtonStyle = {
  textAlign?: TextAlign;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  cursor?: string;
  [key: string]: string | undefined;
};

type Button = {
  id?: string;
  text: string | JSX.Element;
  textSize: string;
  textAlign: TextAlign;
  textColor: string;
  fontWeight?: string;
  width: string;
  height: string;
  padding: string;
  margin: string;
  color: string;
  borderRound: string;
  borderThickness: string;
  cursor: string;
  onClick: () => void;
  style?: ButtonStyle;
};

const Button = ({
  id,
  text,
  textSize,
  textAlign,
  textColor,
  fontWeight,
  width,
  height,
  padding,
  margin,
  color,
  borderRound,
  borderThickness,
  cursor,
  onClick,
  style,
}: Button): JSX.Element => {
  const buttonStyle = {
    textAlign: textAlign,
    fontSize: textSize,
    color: textColor,
    fontWeight: fontWeight,
    width: width,
    height: height,
    padding: padding,
    margin: margin,
    backgroundColor: color,
    borderRadius: borderRound,
    border: borderThickness,
    cursor: cursor,
  };
  return (
    <div
      id={id}
      className="noselect button-17"
      style={{ ...buttonStyle, ...style }}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

Button.defaultProps = {
  id: 'btn',
  text: 'Click',
  textSize: '15px',
  textAlign: 'center',
  textColor: 'white',
  fontWeight: 'normal',
  width: '9rem',
  height: '3em',
  padding: '3px',
  margin: '0',
  color: 'steelblue',
  borderRound: '7px',
  borderThickness: '2px',
  cursor: 'pointer',
  onClick: () => {
    alert('OMG! You clicked me 😱😱');
  },
};

export default Button;
