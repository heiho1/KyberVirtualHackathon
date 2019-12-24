import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

import '../../App.css';
import Donut from '../PercentageDoughnut';
import NavigationBar from '../NavigationBar';
import {
  INDIVIDUAL_ZAP_PAGE,
  GENERATE_ZAP
} from '../../constants/googleAnalytics';
import { registerEvent } from '../../api/googleAnalytics';
import BuyButtonContainer from '../BuyButton/BuyButtonContainer';
import GiftButton from '../GiftButton';

const footerButtons = () => (
  <div className="row justify-content-center my-1">
    <div className="col-12 col-md-12 col-lg-12 text-center">
      <Button variant="outline-info" size="lg" href="/survey" type="link" block>
        Not sure which to pick? Try Zap Generator
      </Button>
      <hr />
      <Button
        variant="outline-info"
        target="_blank"
        size="lg"
        href="https://defizap.typeform.com/to/UZSZg5"
        type="link"
        block
        onClick={() =>
          registerEvent({
            category: GENERATE_ZAP,
            action: INDIVIDUAL_ZAP_PAGE
          })
        }
      >
        Don&apos;t see your Zap? Submit a request and we will create one!
      </Button>
    </div>
  </div>
);

const Zap = props => {
  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <Col xs={12} md={4} lg={3} key={props.name} className="m-4 bg-white">
      <Col className="align-text-center">
        <Donut data={props} />
      </Col>
      <Col>
        {props.isOrderable ? null : (
          <>
            <h4>This Zap is still under development.</h4>
            <h4>
              In the meantime, check out available Zaps <a href="/zaps">here</a>
              .
            </h4>
          </>
        )}
        <Row className="text-center pt-2">
          <Col className="text-sm-center">
            {props.oneClickAccessTo ? (
              <span>
                <h6 style={{ fontSize: '0.8em' }}>1-CLICK ACCESS TO:</h6>
                <h6>
                  {props.oneClickAccessTo.map((access, index) => (
                    <Row key={access.text} className="justify-content-center">
                      <Badge
                        style={{ backgroundColor: access.color }}
                        variant="primary"
                        className={index === 0 ? 'beforePill' : 'afterPill'}
                      >
                        {access.text}
                      </Badge>
                    </Row>
                  ))}
                  {props.oneClickAccessTo.length === 1 ? (
                    <div className="my-3 pb-2" />
                  ) : null}
                </h6>
              </span>
            ) : (
              ''
            )}
            {props.platformsUsed ? (
              <span>
                <h6 style={{ fontSize: '0.8em' }}>PLATFORMS USED:</h6>
                <h6>
                  {props.platformsUsed.map((platform, index) => (
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
                </h6>
              </span>
            ) : (
              ''
            )}
            {props.metamaskInteractionsSaved ? (
              <span>
                <h6 style={{ fontSize: '0.8em' }}>
                  WALLET INTERACTIONS SAVED: <br />
                  <h6>
                    <b style={{ fontSize: '1.8em' }}>
                      {props.metamaskInteractionsSaved.map(
                        interactions => interactions.saved
                      )}
                    </b>
                  </h6>
                </h6>
              </span>
            ) : null}
            {props.volume ? (
              <span>
                <h6 style={{ fontSize: '0.9em' }}>DEPLOYED THROUGH THIS ZAP:</h6>
                <h6>
                  <b style={{ fontSize: '1.8em' }}>
                    {props.volume ? numberWithCommas(props.volume) : '-'} ETH
                  </b>
                  <p
                    className="pt-1"
                    style={{ fontSize: '0.6em', opacity: '70%' }}
                  >
                    Updated every 6 hours
                  </p>
                </h6>
              </span>
            ) : null}
          </Col>
        </Row>
      </Col>
      <Col>
        {props.isOrderable ? (
          <div className="mt-md-2 mt-2 pb-md-0 pb-3 d-flex justify-content-center">
            <a style={{whiteSpace:'nowrap'}}href={`/zaps/${props.id}`}>Learn More</a>
          </div>
        ) : null}
        <div className="my-3 text-center">
          <div className="m-2">
            <BuyButtonContainer {...props} block />
          </div>
          <div className="m-2">
            <GiftButton {...props} block />
          </div>
        </div>
      </Col>
    </Col>
  );
};

const ZapListView = props => {
  const { data } = props;
  return (
    <Container>
      <NavigationBar />
      <Row className="d-flex justify-content-around">
        {data.filter(zap => zap.isOrderable).map(zap => Zap(zap))}
      </Row>
      <hr />
      {footerButtons()}
      <br />
      <br />
    </Container>
  );
};

export default ZapListView;

export { Zap };
