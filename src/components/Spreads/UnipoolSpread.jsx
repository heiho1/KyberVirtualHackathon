import React from 'react';
import { ethers } from 'ethers';
import {
  ETH,
  INITIAL_TOKENS_CONTEXT,
  useTokenDetails
} from '../../uniswap/contexts/Tokens';
import Zaps from '../../constants/Zaps';
import { useTokenContract } from '../../hooks';
import {
  useExchangeReserves,
  useAddressBalance
} from '../../uniswap/contexts/Balances';
import {
  amountFormatter,
  getExchangeRate,
  calculateEtherTokenOutputFromInput
} from '../../uniswap/zap_uniswap';

const UNIPOOLS = {
  unipooldai: {
    DAI: 50,
    LIQUIDITY: 50
  },
  unipoolmkr: {
    MKR: 50,
    LIQUIDITY: 50
  },
  unipoolsai: {
    SAI: 50,
    LIQUIDITY: 50
  },
  unipoolseth: {
    sETH: 50,
    LIQUIDITY: 50
  },
  unipoolsnx: {
    SNX: 50,
    LIQUIDITY: 50
  }
};

const UnipoolSpread = ({ type, input }) => {
  const zap = Zaps[type];
  console.log(JSON.stringify(UNIPOOLS));
  const spread = UNIPOOLS[type];
  console.log(
    `Spread ${type} with ${input} and Zap ${
      zap.name
    } has spread ${JSON.stringify(spread)}`
  );
  const symbol = Object.keys(UNIPOOLS[type]).filter(nm => { return nm !== 'LIQUIDITY'; })[0];
  console.log(`Got a symbol ${symbol}`);
  const tokenAddress = Object.keys(INITIAL_TOKENS_CONTEXT[1]).filter(ky => {
    return INITIAL_TOKENS_CONTEXT[1][ky].symbol === symbol;
  })[0];
  const token = INITIAL_TOKENS_CONTEXT[1][tokenAddress];
  const {
    reserveETH: outputReserveETH,
    reserveToken: outputReserveToken
  } = useExchangeReserves(tokenAddress);
  console.log(
    `outputReserveETH - ${outputReserveETH} outputReserveToken - ${outputReserveToken}`
  );

  const {
    reserveETH: inputReserveETH,
    reserveToken: inputReserveToken
  } = useExchangeReserves(null);
  console.log(
    `inputReserveETH - ${inputReserveETH} inputReserveToken - ${inputReserveToken} `
  );

  const exchangeRate = getExchangeRate(
    outputReserveETH,
    18,
    outputReserveToken,
    token.decimals,
    false
  );
  console.log(`Got exchangeRate ${exchangeRate}`);

  if (!input) {
    return <h6>Please enter a value to calculate spread.</h6>;
  }
  // only half of the input goes towards token swap
  const inputAsBigNumber = ethers.utils.parseUnits(input, 18).div(2);
  console.log(`inputAsBigNumber - ${inputAsBigNumber.toString()}`);
  const tokenPurchaseAmount = calculateEtherTokenOutputFromInput(
    inputAsBigNumber,
    outputReserveETH,
    outputReserveToken
  );

  return (
    <div>
      <h5>
        Your {token.symbol} purchase amount:{' '}
        {amountFormatter(tokenPurchaseAmount)}
      </h5>
      <h6>
        Exchange Rate: 1 ETH to {amountFormatter(exchangeRate)} {token.symbol}
      </h6>
    </div>
  );
};

export default UnipoolSpread;
