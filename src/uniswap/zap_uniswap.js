// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/utils/index.js
// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/connectors/index.js

import { useMemo } from 'react';
import { getMarketDetails, BigNumber } from '@uniswap/sdk';
import { getContract } from '../../../utils/contracts';
import FACTORY_ABI from './abis/factory';
import EXCHANGE_ABI from './abis/exchange';
import { useWeb3React } from '../../../hooks';

export const FACTORY_ADDRESSES = {
  1: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  3: '0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351',
  4: '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36',
  42: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30'
};

const DAI = 'DAI';
const USDC = 'USDC';
const TUSD = 'TUSD';

const USD_STABLECOINS = [DAI, USDC, TUSD];

// account is optional
export function getFactoryContract(networkId, library, account) {
  return getContract(
    FACTORY_ADDRESSES[networkId],
    FACTORY_ABI,
    library,
    account
  );
}

// account is optional
export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account);
}

// returns null on errors
export function useFactoryContract(withSignerIfPossible = true) {
  const { chainId, library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return getFactoryContract(
        chainId,
        library,
        withSignerIfPossible ? account : undefined
      );
    } catch {
      return null;
    }
  }, [chainId, library, withSignerIfPossible, account]);
}

export function useExchangeContract(
  exchangeAddress,
  withSignerIfPossible = true
) {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return getExchangeContract(
        exchangeAddress,
        library,
        withSignerIfPossible ? account : undefined
      );
    } catch {
      return null;
    }
  }, [exchangeAddress, library, withSignerIfPossible, account]);
}

// get the exchange address for a token from the factory
export async function getTokenExchangeAddressFromFactory(
  tokenAddress,
  networkId,
  library
) {
  return getFactoryContract(networkId, library).getExchange(tokenAddress);
}

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) =>
          accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null,
        object
      )
    : null;
}

// returns a deep copied + sorted list of values, as well as a sortmap
export function sortBigNumbers(values) {
  const valueMap = values.map((value, i) => ({ value, i }));

  valueMap.sort((a, b) => {
    if (a.value.isGreaterThan(b.value)) {
      return 1;
    }
    if (a.value.isLessThan(b.value)) {
      return -1;
    }
    return 0;
  });

  return [
    valueMap.map(element => values[element.i]),
    values.map((_, i) => valueMap.findIndex(element => element.i === i))
  ];
}

export function getMedian(values) {
  const [sortedValues, sortMap] = sortBigNumbers(values);
  if (values.length % 2 === 0) {
    const middle = values.length / 2;
    const indices = [middle - 1, middle];
    return [
      sortedValues[middle - 1].plus(sortedValues[middle]).dividedBy(2),
      sortMap.map(element =>
        indices.includes(element) ? new BigNumber(0.5) : new BigNumber(0)
      )
    ];
  }
  const middle = Math.floor(values.length / 2);
  return [
    sortedValues[middle],
    sortMap.map(element =>
      element === middle ? new BigNumber(1) : new BigNumber(0)
    )
  ];
}

export function getMean(values, _weights) {
  const weights = _weights ? _weights : values.map(() => new BigNumber(1));

  const weightedValues = values.map((value, i) =>
    value.multipliedBy(weights[i])
  );
  const numerator = weightedValues.reduce(
    (accumulator, currentValue) => accumulator.plus(currentValue),
    new BigNumber(0)
  );
  const denominator = weights.reduce(
    (accumulator, currentValue) => accumulator.plus(currentValue),
    new BigNumber(0)
  );

  return [
    numerator.dividedBy(denominator),
    weights.map(weight => weight.dividedBy(denominator))
  ];
}

function forEachStablecoin(runner) {
  return USD_STABLECOINS.map((stablecoin, index) => runner(index, stablecoin));
}

export function getUSDPrice(reserves) {
  const marketDetails = forEachStablecoin(i =>
    getMarketDetails(reserves[i], undefined)
  );
  const ethPrices = forEachStablecoin(
    i => marketDetails[i].marketRate.rateInverted
  );

  const [median] = getMedian(ethPrices);
  const [mean] = getMean(ethPrices);
  const [weightedMean] = getMean(
    ethPrices,
    forEachStablecoin(i => reserves[i].ethReserve.amount)
  );

  // const _stablecoinWeights = [
  //   getMean([medianWeights[0], meanWeights[0], weightedMeanWeights[0]])[0],
  //   getMean([medianWeights[1], meanWeights[1], weightedMeanWeights[1]])[0],
  //   getMean([medianWeights[2], meanWeights[2], weightedMeanWeights[2]])[0]
  // ]
  // const stablecoinWeights = forEachStablecoin((i, stablecoin) => ({
  //   [stablecoin]: _stablecoinWeights[i]
  // })).reduce((accumulator, currentValue) => ({ ...accumulator, ...currentValue }), {})

  return getMean([median, mean, weightedMean])[0];
}
