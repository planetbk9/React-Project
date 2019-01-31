import React, { Component } from 'react';
import './History.scss';
import bricklayout from 'utils/bricklayout';
import funcs from 'utils/funcs';

class History extends Component {
  timeout = -1;
  onResize = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      bricklayout()();
    }, 200);
  }
  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }
  shouldComponentUpdate() {
    // 최적화 필요
    return true;
  }
  componentDidUpdate() {
    bricklayout()();
  }
  ComponentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const { items } = this.props;
    let elemItems = [];
    // 최적화 필요
    items.forEach(item => {
      elemItems = elemItems.concat(
        <div key={item._id} className="brick-item-common brick-item-2">
          <div className="history-item">
            <p className="history-date">{item._id}</p>
            <p className="history-time">{funcs.timeToString(item.time)}</p>
          </div>
        </div>
      );
    });
    return (
      <div className="history-container">
        <header>History</header>
        <main>
          <div className="brickcontainer">
            {elemItems}
          </div>
        </main>
      </div>
    );
  }
}

export default History;