import React, { useState, useEffect } from 'react';

// Register amis render 
const Amis = props => {
  const {schema, data} = props;
  return <>
      <div id="amis-root">
      {(window as any).amis.render(schema, data)}
      </div>
  </>;
}
 
export default Amis