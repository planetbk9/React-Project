import React, { Component } from 'react';
import './History.scss';
import bricklayout from 'utils/bricklayout';

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
    window.setTimeout(bricklayout(), 200);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // 최적화 필요
    return this.props !== nextProps;
  }
  componentDidUpdate() {
    bricklayout()();
  }
  ComponentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div className="history-container">
        <div>
          <h2 className="history-mention">히스토리</h2>
          {this.props.state === 'logout' ?<p className="history-logout-mention">로그인 시, 사용할 수 있습니다.</p>:''}
        </div>
        <div className="brickcontainer">
          {this.props.items}
        </div>
      </div>
    );
  }
}

export default History;