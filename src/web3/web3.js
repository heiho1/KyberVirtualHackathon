import Onboard from 'bnc-onboard';
import Web3 from 'web3';

// eslint-disable-next-line import/no-mutable-exports
let web3;

const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
const PORTIS_KEY = process.env.REACT_APP_PORTIS_KEY;
// const SQUARELINK_KEY = process.env.REACT_APP_SQUARELINK_KEY;
// const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

const wallets = [
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'fortmatic',
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  {
    walletName: 'portis',
    apiKey: PORTIS_KEY,
    preferred: true
  }
  // Currently commented out.
  // { walletName: 'dapper', preferred: true },
  // {
  //   walletName: 'squarelink',
  //   apiKey: SQUARELINK_KEY
  // },
  // { walletName: 'authereum' },
  // {
  //   walletName: 'walletConnect',
  //   infuraKey: INFURA_KEY
  // },
  // { walletName: 'coinbase', preferred: true },
  // { walletName: 'trust', preferred: true }
];

const initializationOptions = {
  dappId: process.env.REACT_APP_BLOCKNATIVE_ID,
  networkId: 1,
  darkMode: true,
  subscriptions: {
    wallet: wallet => {
      web3 = new Web3(wallet.provider);
    }
  },
  walletSelect: {
    heading: 'Select a Wallet',
    description: `If your wallet is a smart contract wallet,
    please ensure that your wallet supports accepting the tokens that you shall receive.`,
    wallets
  }
};

const onboard = Onboard(initializationOptions);

export { onboard, web3 };
