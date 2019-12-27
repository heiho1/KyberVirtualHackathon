import React, { PureComponent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import autobind from 'react-autobind';

// import ReturnSparkLine from '../ReturnSparkline';
// import PercentageCircle from '../PercentageCircle';
import BuyButtonContainer from '../BuyButton/BuyButtonContainer';
import GiftButton from '../GiftButton';
import Donut from '../PercentageDoughnut';
import '../../App.css';

class ZapFullView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  render() {
    const illustrations = require.context('../../assets/illustrations', true);
    const {
      description,
      hasReturnsChart,
      oneClickAccessTo,
      platformsUsed,
      metamaskInteractionsSaved,
      ensAddress,
      gasLimitRequirement,
      tokenInfo,
      tokenAddress,
      volume,
      illustration,
      stats
    } = this.props;

    return (
      <Card>
        <Card.Body className="text-center">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={4}>
              <Donut data={this.props} />
            </Col>
          </Row>
          <br />
          <Row className="justify-content-center mt-3 mb-2 px-4">
            <Col xs={12} md={6} className="justify-content-center text-center">
              <BuyButtonContainer {...this.props} size="md" />
            </Col>
          </Row>
          <Row className="justify-content-center mb-4 px-4">
            <Col xs={12} md={6} className="justify-content-center text-center">
              <GiftButton {...this.props} size="md" />
            </Col>

          </Row>

          <Row className="justify-content-center align-text-center">
            <Col xs={12} md={6} className="justify-content-center text-center">
              {oneClickAccessTo ? (
                <span>
                  <h5
                    style={{ fontSize: '0.9em' }}
                    className="zapFullViewHeader"
                  >
                    {' '}
                    1-CLICK ACCESS TO:
                  </h5>
                  <h5>
                    {oneClickAccessTo.map((access, index) => (
                      <Row key={access.text} className="justify-content-center">
                        <Badge
                          key={access.text}
                          style={{ backgroundColor: access.color }}
                          variant="primary"
                          className={index === 0 ? 'beforePill' : 'afterPill'}
                        >
                          {access.text}
                        </Badge>
                      </Row>
                    ))}
                  </h5>
                </span>
              ) : null}
              {platformsUsed ? (
                <span>
                  <h5 style={{ fontSize: '0.9em' }}>PLATFORMS USED:</h5>
                  <h5>
                    {platformsUsed.map((platform, index) => (
                      <a
                        href={platform.url}
                        key={platform.value}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Badge
                          style={{ backgroundColor: platform.color }}
                          variant="success"
                          // className={index === 0 ? 'beforePill' : 'afterPill'}
                          className="badgePadding"
                        >
                          {platform.value}
                        </Badge>
                      </a>
                    ))}
                  </h5>
                </span>
              ) : null}
              <h5 style={{ fontSize: '0.9em' }} className="pt-2">
                WHAT THIS MEANS:
              </h5>
              {illustration ? (
                <img
                  className="pb-2"
                  src={illustrations(`./${illustration}`)}
                />
              ) : this.props.whatThisMeans ? (
                <span>
                  <h5>What this means:</h5>
                  <ul>
                    {this.props.whatThisMeans.text.map(item => (
                      <li key={item} className="text-left">
                        {item}
                      </li>
                    ))}
                  </ul>
                </span>
              ) : null}
              {metamaskInteractionsSaved ? (
                <span>
                  <h5 style={{ fontSize: '0.9em' }}>
                    WALLET INTERACTIONS SAVED:
                  </h5>
                  <b style={{ fontSize: '1.8em' }}>
                    {metamaskInteractionsSaved.map(
                      interactions => interactions.saved
                    )}
                  </b>
                </span>
              ) : null}
              {stats ? (
                <span>
                  <h6 style={{ fontSize: '0.9em' }}>
                    DEPLOYED THROUGH THIS ZAP:
                  </h6>
                  <h6>
                    <b style={{ fontSize: '1.8em' }}>
                      {stats.volumeETH ? this.numberWithCommas(stats.volumeETH.toFixed(0)) : '-'} ETH
                    </b>
                    <p
                      className="pt-1"
                      style={{ fontSize: '0.6em', opacity: '70%' }}
                    >
                      Updated {new Date(stats.updated).toLocaleString()}
                    </p>
                  </h6>
                </span>
              ) : null}
              {ensAddress ? (
                <span>
                  <h5 style={{ fontSize: '0.9em' }}>
                    VIEW CONTRACT ON ETHERSCAN:
                  </h5>
                  <h5>
                    <a
                      href={`https://etherscan.io/address/${ensAddress}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Badge variant="info">{ensAddress}</Badge>
                    </a>
                  </h5>
                  <p style={{ fontSize: '0.75em' }}>
                    Alternatively send ETH directly to this address using
                    <i> minimum </i>
                    {gasLimitRequirement} gas.
                  </p>
                </span>
              ) : null}
              <a
                href={description.tutorialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="my-1"
              >
                <h5>View Detailed Tutorial</h5>
              </a>
              <div className="mt-2">
                {hasReturnsChart ? (
                  <a
                    href={`https://pools.fyi/#/returns/${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-1"
                  >
                    <h5>View Returns on Pools.fyi</h5>
                  </a>
                ) : null}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default ZapFullView;
