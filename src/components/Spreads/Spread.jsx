import React from 'react';
import Zaps from '../../constants/Zaps';
import UnipoolSpread from './UnipoolSpread';

function isUnipool(type) {
  const TYPES = ['unipoolsnx', 'unipoolseth', 'unipoolsai', 'unipoolmkr', 'unipooldai'];
  return TYPES.includes(type);
}

const Spread = ({ type, input }) => {
  const zap = Zaps[type];
  console.log(`Spread ${type} with ${input} and Zap ${zap.name} is WIP`);
  if (isUnipool(type)) {
    return <UnipoolSpread type={type} input={input} />;
  }
  return <div>&nbsp;</div>;
};

export default Spread;
