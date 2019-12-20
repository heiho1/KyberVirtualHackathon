// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/utils/index.js
import { ethers } from 'ethers';
import { isAddress, getContract } from './contracts';
import ERC20_ABI from './abis/erc20';
import ERC20_BYTES32_ABI from './abis/erc20_bytes32';

export const ERROR_CODES = [
  'TOKEN_NAME',
  'TOKEN_SYMBOL',
  'TOKEN_DECIMALS'
].reduce((accumulator, currentValue, currentIndex) => {
  accumulator[currentValue] = currentIndex;
  return accumulator;
}, {});

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`;
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`;
}

// get token name
export async function getTokenName(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  return getContract(tokenAddress, ERC20_ABI, library)
    .name()
    .catch(() =>
      getContract(tokenAddress, ERC20_BYTES32_ABI, library)
        .name()
        .then(bytes32 => ethers.utils.parseBytes32String(bytes32))
    )
    .catch(error => {
      // eslint-disable-next-line no-param-reassign
      error.code = ERROR_CODES.TOKEN_SYMBOL;
      throw error;
    });
}

// get token symbol
export async function getTokenSymbol(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  return getContract(tokenAddress, ERC20_ABI, library)
    .symbol()
    .catch(() => {
      const contractBytes32 = getContract(
        tokenAddress,
        ERC20_BYTES32_ABI,
        library
      );
      return contractBytes32
        .symbol()
        .then(bytes32 => ethers.utils.parseBytes32String(bytes32));
    })
    .catch(error => {
      // eslint-disable-next-line no-param-reassign
      error.code = ERROR_CODES.TOKEN_SYMBOL;
      throw error;
    });
}

// get token decimals
export async function getTokenDecimals(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`);
  }

  return getContract(tokenAddress, ERC20_ABI, library)
    .decimals()
    .catch(error => {
      // eslint-disable-next-line no-param-reassign
      error.code = ERROR_CODES.TOKEN_DECIMALS;
      throw error;
    });
}
// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  console.log(
    `getTokenBalance tokenAddress - ${tokenAddress} address - ${address} library - ${library}`
  );
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(
      `Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address);
}

// get the token allowance
export async function getTokenAllowance(
  address,
  tokenAddress,
  spenderAddress,
  library
) {
  if (
    !isAddress(address) ||
    !isAddress(tokenAddress) ||
    !isAddress(spenderAddress)
  ) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(
    address,
    spenderAddress
  );
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  console.log(`getEtherBalance address - ${address} library - ${Object.keys(library)}`);
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`);
  }
  return library.getBalance(address);
}
