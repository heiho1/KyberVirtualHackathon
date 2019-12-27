import React, { PureComponent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import autobind from 'react-autobind';

import {
  getTokenReserves,
  getMarketDetails,
  getTradeDetails,
  BigNumber,
  formatFixed,
  formatFixedDecimals
} from '@uniswap/sdk';
import web3 from 'web3';
import Humanize from 'humanize-plus';

import '../../App.css';

class Simulator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      chainId: 1,
      decimals: 18,
      totalSupply: 0
    };

    autobind(this);
  }

  async componentDidMount() {
    const tradeDetails = await this.getTradeDetails(
      this.props.value || 0,
      this.props.tokenInfo.address
    );
    this.processTradeDetails(tradeDetails);
    await this.getUniswapTokenBalance(this.props.tokenAddress);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      const tradeDetails = await this.getTradeDetails(
        this.props.value || 0,
        this.props.tokenInfo.address
      );
      this.processTradeDetails(tradeDetails);
    }
  }

  getTokenReserves = async tokenAddress => {
    const checksumAddress = web3.utils.toChecksumAddress(tokenAddress);
    const tokenReserves = await getTokenReserves(
      checksumAddress,
      this.state.chainId
    );
    return tokenReserves;
  };

  getMarketDetails = async tokenAddress => {
    const reserves = await this.getTokenReserves(tokenAddress);
    const marketDetails = await getMarketDetails(undefined, reserves);
    return marketDetails;
  };

  getTradeDetails = async (_tradeAmount, tokenAddress) => {
    const marketDetails = await this.getMarketDetails(tokenAddress);
    const tradeAmount = new BigNumber(_tradeAmount).multipliedBy(
      10 ** this.props.tokenInfo.decimals
    );
    const tradeDetails = await getTradeDetails(
      true,
      tradeAmount,
      marketDetails
    );
    return tradeDetails;
  };

  processTradeDetails = tradeDetails => {
    const ethReserves = formatFixedDecimals(
      tradeDetails.marketDetailsPre.outputReserves.ethReserve.amount,
      18,
      { decimalPlaces: 2 }
    );
    const tokenReserves = formatFixedDecimals(
      tradeDetails.marketDetailsPre.outputReserves.tokenReserve.amount,
      this.props.tokenInfo.decimals,
      { decimalPlaces: 2 }
    );
    const marketRate = formatFixed(
      tradeDetails.marketDetailsPre.marketRate.rate,
      { decimalPlaces: 2 }
    );
    const execRate = formatFixed(tradeDetails.executionRate.rate, {
      decimalPlaces: 2
    });
    // console.log(ethReserves, tokenReserves, marketRate, execRate)
    this.setState({ ethReserves, tokenReserves, marketRate, execRate });
  };

  // In relation to uniswap liquidity tokens (i.e Uniswap V1 tokens)
  getUniswapTokenBalance = async uniswapAddress => {
    const tokenInfo = await (
      await fetch(
        `https://api.ethplorer.io/getTokenInfo/${uniswapAddress}?apiKey=freekey`
      )
    ).json();
    const liquidityTokenSupply = tokenInfo.totalSupply / 10 ** 18;
    this.setState({ liquidityTokenSupply });
  };

  getLiquidityTokenOutput = (
    value,
    execRate,
    tokenReserves,
    liquidityTokenSupply
  ) => {
    return (
      ((value * 0.505 * execRate) / tokenReserves) *
      liquidityTokenSupply
    ).toFixed(3);
  };

  render() {
    const { value, tokenInfo } = this.props;

    const {
      ethReserves,
      tokenReserves,
      marketRate,
      execRate,
      liquidityTokenSupply
    } = this.state;

    if (ethReserves && tokenReserves && marketRate)
      return (
        <div style={{ fontSize: '0.85em' }}>
          <Row className="justify-content-left pt-2">
            <Col>Current Pool Size:</Col>
            <Col style={{ whiteSpace: 'nowrap' }}>
              {Humanize.compactInteger(ethReserves, 1)} ETH +{' '}
              {Humanize.compactInteger(tokenReserves, 1)} {tokenInfo.name}
            </Col>
          </Row>
          <Row className="justify-content-left">
            <Col>
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    {tokenInfo.name === 'CHAI' || tokenInfo.name ==='cDAI'
                      ? `In order to avoid excessive slippage, half of your input ETH is converted to DAI on Kyber before being wrapped into ${tokenInfo.name}. Ether split is weighted 50.5% into entry ERC20. After adding the liquidity to the pool, we return a small fraction of the entry ERC20 which wasn't used.`
                      : `Ether split is weighted 50.5% into entry ERC20. After adding the liquidity to the pool, we return a small fraction of the entry ERC20 which wasn't used.`}
                  </Tooltip>
                }
                placement="right"
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
              </OverlayTrigger>{' '}
              Est. Pool Share:
            </Col>
            <Col
              style={{ color: value ? '#eb9100' : null, whiteSpace: 'noWrap' }}
            >
              {`${(value * 0.495).toFixed(3)} ETH + ${(
                value *
                0.505 *
                execRate
              ).toFixed(3)} ${tokenInfo.name}`}
            </Col>
          </Row>
          <Row className="justify-content-right">
            <Col>Est. Ouput:</Col>
            <Col
              style={{ color: value ? '#28a745' : null, whiteSpace: 'noWrap' }}
            >
              {value && execRate > 0
                ? `${this.getLiquidityTokenOutput(
                    value,
                    execRate,
                    tokenReserves,
                    liquidityTokenSupply
                  )} ${tokenInfo.name} Pool Token`
                : `0 ${tokenInfo.name} Pool Token`}
            </Col>
          </Row>
          <Row className="justify-content-right">
            <Col>DeFiZap Fee:</Col>
            <Col>{value && execRate > 0 ? 'FREE' : `-`}</Col>
          </Row>
        </div>
      );
    return (
      <Row className="justify-content-center pt-2">
        <Spinner animation="border">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  }
}

export default Simulator;
