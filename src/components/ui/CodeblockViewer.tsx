import React from 'react';

type TextAlignType =
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'initial'
  | 'inherit';

type CustomStyleType = {
  textAlign?: TextAlignType;
  marginLeft?: string;
  marginTop?: string;
  fontSize: number;
  overflow?: string;
  [key: string]: number | string | undefined;
};

type CodeblockViewerType = {
  customStyle?: CustomStyleType;
  codeblock: string | string[] | JSX.Element;
};

const CodeblockViewer = ({
  customStyle,
  codeblock,
}: CodeblockViewerType): JSX.Element => {
  const defaultStyle: CustomStyleType = {
    textAlign: 'left',
    marginLeft: '2rem',
    marginTop: '0px',
    fontSize: 14,
    overflow: 'auto',
  };
  return <pre style={{ ...defaultStyle, ...customStyle }}>{codeblock}</pre>;
};

export default CodeblockViewer;
