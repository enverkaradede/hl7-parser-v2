import React from 'react';
import '../../style/layouts/Header.css';

const PageHeader = ({ name }: { name: string }): JSX.Element => {
  return (
    <div className="page-header mb-32 text-5xl">
      <h1>{name}</h1>
    </div>
  );
};

export default PageHeader;
