import React from 'react';

export default function Error(props) {
  const { is404 } = props;

  return (
    <h1>{is404 ? 'not found' : 'error'}</h1>
  );
}
