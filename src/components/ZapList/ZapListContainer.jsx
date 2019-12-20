import React, { PureComponent } from 'react';
import autobind from 'react-autobind';

// import ZapListView from './ZapListView';
import ZapListViewV2 from './ZapListViewV2';
import Zaps from '../../constants/Zaps';

class ZapListContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  types = () => Object.keys(Zaps);

  data = () => Object.values(Zaps);

  render() {
    return (
      <div>
        <ZapListViewV2 data={this.data()} />
      </div>
    );
  }
}

export default ZapListContainer;
