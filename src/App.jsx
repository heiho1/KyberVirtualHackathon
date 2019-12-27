import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import autobind from 'react-autobind';
import { connect } from 'react-redux';

import './App.css';

import {
  useWeb3React as useWeb3ReactCore,
  Web3ReactProvider,
  createWeb3ReactRoot
} from '@web3-react/core';
import { ethers } from 'ethers';
import { NetworkContextName } from './constants/networks';
import Web3ReactManager from './components/Web3ReactManager';
import ZapsPage from './components/Zaps';
import Survey from './components/SurveyPage';
import ZapListContainer from './components/ZapList/ZapListContainer';
import LandingPage from './components/LandingPage';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ApplicationContextProvider, {
  Updater as ApplicationContextUpdater
} from './uniswap/contexts/Application';
import TokensContextProvider from './uniswap/contexts/Tokens';
import BalancesContextProvider from './uniswap/contexts/Balances';
import AllowancesContextProvider from './uniswap/contexts/Allowances';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000;
  console.log(
    `getLibrary provider - ${Object.keys(provider)} has library - ${Object.keys(
      library
    )}`
  );
  return library;
}

function ContextProviders({ children }) {
  return (
    <ApplicationContextProvider>
      <TokensContextProvider>
        <BalancesContextProvider>
          <AllowancesContextProvider>{children}</AllowancesContextProvider>
        </BalancesContextProvider>
      </TokensContextProvider>
    </ApplicationContextProvider>
  );
}

function Updaters() {
  return (
    <div>
      <ApplicationContextUpdater />
    </div>
  );
}

class App extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      location: PropTypes.shape({ search: PropTypes.string }),
      listen: PropTypes.func,
      replace: PropTypes.func
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const { history } = this.props;
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <ContextProviders>
              <Updaters />
              <Router history={history}>
                <Switch>
                  <Route exact path="/" component={LandingPage} />
                  {/* <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/analytics" component={Analytics} /> */}
                  <Route exact path="/survey" component={Survey} />
                  <Route exact path="/zaps" component={ZapListContainer} />
                  <Route exact path="/zaps/:id" component={ZapsPage} />
                </Switch>
              </Router>
            </ContextProviders>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
