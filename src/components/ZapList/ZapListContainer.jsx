import React, { PureComponent } from 'react';
import autobind from 'react-autobind';

// import ZapListView from './ZapListView';
import ZapListViewV2 from './ZapListViewV2';
import Zaps from '../../constants/Zaps';
import ZapStats from '../../api/zapStats'

class ZapListContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  async componentDidMount() {
    const stats = await ZapStats()
    this.setState({ stats })
  }

  data = () => {
    const data = Object.values(Zaps);
    const stats = this.state.stats
    if(stats){
      stats.forEach(stat =>{
        data.forEach(zap =>{
          if(stat.name === zap.name)
          zap.stats = stat
        })
      })
    }
    return data
  }

  render() {
    return <ZapListViewV2 data={this.data()}/>;
    // return <ZapListView />;
  }
}

export default ZapListContainer;
