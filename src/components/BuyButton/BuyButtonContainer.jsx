import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Row from 'react-bootstrap/Row';
import Web3 from 'web3';
import isEmpty from 'lodash/isEmpty';
import '../../App.css';
import Loading from '../Loading';
import contractProvider from '../../utils/web3DataProvider';
import { registerEvent } from '../../api/googleAnalytics';
import { BUY_ZAP, INITIATE_PURCHASE } from '../../constants/googleAnalytics';
import {
  fetchRequest,
  buildOptions,
  checkResponse
} from '../../api/apiHelpers';

// import Spreads from '../Spreads';
import Spread from '../Spreads/Spread';

class LenderBuyButton extends React.Component {
  constructor(props) {
    super(props);

    let web3 = {};
    if (
      typeof window.ethereum !== 'undefined' ||
      typeof window.web3 !== 'undefined'
    ) {
      const provider = window.ethereum || window.web3.currentProvider;
      web3 = new Web3(provider);
    }

    this.state = {
      open: false,
      value: '',
      account: null,
      showLoader: false,
      gasMode: 'average',
      errorMessage: '',
      depositTxHash: '',
      web3
    };
  }

  async getGas() {
    const response = await fetchRequest(
      'https://ethgasstation.info/json/ethgasAPI.json',
      () => buildOptions()
    ).then(checkResponse('Failed to get gas from Gas Station'));
    const { gasMode } = this.state;
    const gasValue = (response[`${gasMode}`] / 10) * 1000000000;
    this.setState({ gasValue });
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleSubmit = async event => {
    event.preventDefault();
    registerEvent({
      category: INITIATE_PURCHASE,
      action: this.props.name
    });
    try {
      await this.initialize();
      const networkId = await this.state.web3.eth.net.getId();
      const { ens } = this.state.web3.eth;
      await this.getGas();
      if (networkId !== 1) {
        alert(
          'Sorry, you need to be on the Ethereum MainNet to use our services.'
        );
      } else {
        const {
          contractAbi,
          contractAddress,
          gas,
          gasPrice
        } = contractProvider(this.props.name);
        const newAddress = await ens.getAddress(contractAddress);
        const valueToInvest = this.state.value;
        const contract = new this.state.web3.eth.Contract(
          contractAbi,
          newAddress
        );
        this.setState({ showLoader: true });
        let tx;
        if (this.props.name === 'Lender') {
          tx = await contract.methods.SafeNotSorryZapInvestment();
        } else if (this.props.name === 'ETH Bull') {
          tx = await contract.methods.ETHMaximalistZAP();
        } else {
          tx = await contract.methods.LetsInvest();
        }
        tx.send({
          from: this.state.account,
          value: this.state.web3.utils.toWei(valueToInvest, 'ether'),
          gas,
          gasPrice: isEmpty(gasPrice) ? String(this.state.gasValue) : gasPrice
        })
          .on('receipt', receipt => {
            console.log(
              'the tx hash of the sendInvestment function is',
              receipt.transactionHash
            );
            this.setState({
              depositTxHash: receipt.transactionHash,
              showLoader: false
            });
          })
          .on('error', error => {
            alert(
              'Sorry, we encountered an error, please try again or reach out to us if this persists.'
            );
            this.setState({ showLoader: false });
          });
        console.log(tx);
      }
    } catch (error) {
      console.log(error);
    }
  };

  setGasMode = async gasMode => {
    await this.setState({ gasMode });
  };

  async initialize() {
    try {
      const [account] = await window.ethereum.enable();
      this.setState({ account });
    } catch (error) {
      console.error(error);
      alert('You will need to connect web3 wallet');
      throw error;
    }
  }

  renderModal() {
    const { open, value, web3 } = this.state;
    const { id, name } = this.props;
    return (
      <Modal isOpen={open} toggle={this.toggle} centered>
        <ModalBody>
          <form onSubmit={this.handleSubmit}>
            <div className="buycontainer">
              <h1>{name}</h1>
              <div className="buycontents">
                <p className="buytext pt-4 mr-2">INVEST</p>
                <input
                  min={0.01}
                  type="number"
                  step={0.001}
                  value={value}
                  onChange={this.handleChange}
                  placeholder="0.0"
                  required
                  style={
                    value && value.length > 3
                      ? {
                          width: `${90 + value.length * 20}px`
                        }
                      : {
                          width: '90px'
                        }
                  }
                />
                <p className="buytext pt-4 ml-2">ETH</p>
              </div>
              <div>
                <Spread type={id} input={this.state.value} />
              </div>
              <Row className="justify-content-center py-3">
                Select Transaction Speed:{' '}
              </Row>
              <Row className="justify-content-center py-2">
                <ToggleButtonGroup
                  type="radio"
                  name="gasOptions"
                  value={this.state.gasMode}
                  onChange={this.setGasMode}
                >
                  <ToggleButton
                    variant="outline-success"
                    size="lg"
                    value="average"
                  >
                    Slow
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-success"
                    size="lg"
                    value="fast"
                  >
                    Average
                  </ToggleButton>
                  <ToggleButton
                    size="lg"
                    value="fastest"
                    variant="outline-success"
                  >
                    Fast
                  </ToggleButton>
                </ToggleButtonGroup>
              </Row>
            </div>
            <div className="my-4 row justify-content-center">
              <input
                type="submit"
                className="font20 mx-3 btn btn-outline-success btn-large shadow px-4 py-2"
                value="Confirm"
              />
              <div
                className="font20 btn btn-outline-dark btn-large shadow px-4 py-2 mx-3"
                onClick={this.toggle}
              >
                Cancel
              </div>
              {this.state.showLoader ? <Loading /> : null}
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }

  render() {
    const { isOrderable, name, block, size } = this.props;
    return (
      <>
        {isOrderable ? (
          // eslint-disable-next-line jsx-a11y/accessible-emoji
          <Button
            onClick={() => {
              this.setState({ open: true });
              registerEvent({
                category: BUY_ZAP,
                action: name
              });
            }}
            disabled={!isOrderable}
            variant="outline-primary"
            size={!isEmpty(size) ? size : 'auto'}
            block={block}
          >
            ⚡ Use This Zap
          </Button>
        ) : (
          <Button
            onClick={() => this.setState({ open: true })}
            disabled={!isOrderable}
            variant="outline-primary"
            size={!isEmpty(size) ? size : 'auto'}
            block={block}
          >
            Coming Soon
          </Button>
        )}
        {this.renderModal()}
      </>
    );
  }
}

export default LenderBuyButton;
