import React from 'react';
import '../../style/layouts/PageFooter.css';
// import { openUrlPopup } from '../../utils/electron/windowHelper';
import { isConnectedToInternet } from '../../utils/pure/isConnectedToInternet';

const PageFooter = (): JSX.Element => {
  return (
    <footer className="page-footer" style={{ marginTop: 'auto' }}>
      {'Developed by '}
      {/* <span
        onClick={() =>
          isConnectedToInternet()
            ? openUrlPopup({
                content: 'https://github.com/enverkaradede/hl7-parser-app',
              })
            : "You are not connected to internet. Please check your connection to see the project's GitHub page."
        }
        style={{ color: '#5590bc', textDecoration: 'none', cursor: 'pointer' }}
      >
        {'Enver Karadede'}
      </span> */}
      <a
        href={
          isConnectedToInternet()
            ? 'https://github.com/enverkaradede/hl7-parser-app'
            : "You are not connected to internet. Please check your connection to see the project's GitHub page."
        }
        target="_blank"
        rel="noreferrer"
        style={{ color: '#5590bc', textDecoration: 'none', cursor: 'pointer' }}
      >
        {'Enver Karadede'}
      </a>
    </footer>
  );
};

export default PageFooter;
