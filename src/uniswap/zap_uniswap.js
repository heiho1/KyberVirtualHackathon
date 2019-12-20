// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/utils/index.js
// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/connectors/index.js
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { getMarketDetails, BigNumber } from '@uniswap/sdk';
import { getContract } from '../utils/contracts';
import FACTORY_ABI from './abis/factory';
import EXCHANGE_ABI from './abis/exchange';
import { useWeb3React } from '../hooks';

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

  return getMean([median, mean, weightedMean])[0];
}

export function amountFormatter(
  amount,
  baseDecimals = 18,
  displayDecimals = 3,
  useLessThan = true
) {
  if (amount && (parseInt(amount, 10) || parseFloat(amount))) {
    console.log(
      `amountFormatter amount - ${amount} baseDecimals - ${baseDecimals} displayDecimals - ${displayDecimals} useLessThan ${useLessThan}`
    );
  }
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`
    );
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined;
  }
  // if amount is 0, return
  if (amount.isZero()) {
    return '0';
  }
  // amount > 0
  // amount of 'wei' in 1 'ether'
  const baseAmount = ethers.utils
    .bigNumberify(10)
    .pow(ethers.utils.bigNumberify(baseDecimals));

  const minimumDisplayAmount = baseAmount.div(
    ethers.utils
      .bigNumberify(10)
      .pow(ethers.utils.bigNumberify(displayDecimals))
  );

  // if balance is less than the minimum display amount
  if (amount.lt(minimumDisplayAmount)) {
    return useLessThan
      ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
      : `${ethers.utils.formatUnits(amount, baseDecimals)}`;
  }
  // if the balance is greater than the minimum display amount
  const stringAmount = ethers.utils.formatUnits(amount, baseDecimals);

  // if there isn't a decimal portion
  if (!stringAmount.match(/\./)) {
    return stringAmount;
  }
  // if there is a decimal portion
  const [wholeComponent, decimalComponent] = stringAmount.split('.');
  const roundedDecimalComponent = ethers.utils
    .bigNumberify(decimalComponent.padEnd(baseDecimals, '0'))
    .toString()
    .padStart(baseDecimals, '0')
    .substring(0, displayDecimals);

  // decimals are too small to show
  if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
    return wholeComponent;
  }
  // decimals are not too small to show
  return `${wholeComponent}.${roundedDecimalComponent
    .toString()
    .replace(/0*$/, '')}`;
}

export function getExchangeRate(
  inputValue,
  inputDecimals,
  outputValue,
  outputDecimals,
  invert = false
) {
  console.log(
    `getExchangeRate inputValue - ${inputValue} inputDecimals - ${inputDecimals} outputValue - ${outputValue} outputDecimals ${outputDecimals}`
  );
  try {
    if (
      inputValue &&
      (inputDecimals || inputDecimals === 0) &&
      outputValue &&
      (outputDecimals || outputDecimals === 0)
    ) {
      const factor = ethers.utils
        .bigNumberify(10)
        .pow(ethers.utils.bigNumberify(18));

      if (invert) {
        return inputValue
          .mul(factor)
          .div(outputValue)
          .mul(
            ethers.utils
              .bigNumberify(10)
              .pow(ethers.utils.bigNumberify(outputDecimals))
          )
          .div(
            ethers.utils
              .bigNumberify(10)
              .pow(ethers.utils.bigNumberify(inputDecimals))
          );
      }
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(inputDecimals))
        )
        .div(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(outputDecimals))
        );
    }
  } catch (error) {
    console.log(`Failure - getExchangeRate - ${error}`);
  }
  return new BigNumber(0);
}

export function getMarketRate(
  swapType,
  inputReserveETH,
  inputReserveToken,
  inputDecimals,
  outputReserveETH,
  outputReserveToken,
  outputDecimals,
  invert = false
) {
  console.log(
    `getMarketRate swapType - ${swapType} inputReserveETH - ${inputReserveETH} outputReserveEth - ${outputReserveETH}`
  );
  // NOTE: we only support 'ETH_TO_TOKEN' uniswap so others are omitted
  return getExchangeRate(
    outputReserveETH,
    18,
    outputReserveToken,
    outputDecimals,
    invert
  );
}

export function calculateEtherTokenOutputFromInput(
  inputAmount,
  inputReserve,
  outputReserve
) {
  const inputAmountWithFee = inputAmount.mul(ethers.utils.bigNumberify(997));
  const numerator = inputAmountWithFee.mul(outputReserve);
  const denominator = inputReserve
    .mul(ethers.utils.bigNumberify(1000))
    .add(inputAmountWithFee);
  return numerator.div(denominator);
}

// this mocks the getOutputPrice function, and calculates the required input
export function calculateEtherTokenInputFromOutput(
  outputAmount,
  inputReserve,
  outputReserve
) {
  const numerator = inputReserve
    .mul(outputAmount)
    .mul(ethers.utils.bigNumberify(1000));
  const denominator = outputReserve
    .sub(outputAmount)
    .mul(ethers.utils.bigNumberify(997));
  return numerator.div(denominator).add(ethers.constants.One);
}