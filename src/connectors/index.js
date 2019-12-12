// derived from https://github.com/Uniswap/uniswap-frontend/blob/beta/src/connectors/index.js
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1]
});

export default injected;