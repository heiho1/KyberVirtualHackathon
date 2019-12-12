// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/utils/index.js
import { ethers } from 'ethers';

// account is optional
export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export default class UncheckedJsonRpcSigner extends ethers.Signer {
  constructor(signer) {
    super();
    ethers.utils.defineReadOnly(this, 'signer', signer);
    ethers.utils.defineReadOnly(this, 'provider', signer.provider);
  }

  getAddress() {
    return this.signer.getAddress();
  }

  sendTransaction(transaction) {
    return this.signer.sendUncheckedTransaction(transaction).then(hash => {
      return {
        hash,
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null,
        wait: confirmations => {
          return this.signer.provider.waitForTransaction(hash, confirmations);
        }
      };
    });
  }

  signMessage(message) {
    return this.signer.signMessage(message);
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account
    ? new UncheckedJsonRpcSigner(library.getSigner(account))
    : library;
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new ethers.Contract(
    address,
    ABI,
    getProviderOrSigner(library, account)
  );
}

