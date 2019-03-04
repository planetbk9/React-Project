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
    const { userItems, loadItem, deleteItem } = this.props;
    let userItemsJSX = [];
    // 최적화 필요
    userItems.forEach(userItem => {
      const userItemJSX = userItem.dateItems.map(dateItem => {
        if(dateItem === null) return false;
        return(
          <div key={dateItem._id} className="history-item-container" onClick={() => {loadItem(userItem.date, dateItem._id);}}>
            <div className="history-item-subject">{dateItem.subject}</div>
            <div className="history-item-time">{funcs.timeToString(dateItem.time)}</div>
            <div className="history-item-delete" onClick={() => {deleteItem(dateItem._id);}}><i className="fas fa-times"></i></div>
          </div>
        );
      });
      userItemsJSX = userItemsJSX.concat(
        <div key={userItem._id} className="brick-item-common brick-item-2">
          <div className="history-item-header">
            {userItem.date}
          </div>
          {userItemJSX}
        </div>
      );
    });
    return (
      <div className="history-container">
        <header>히스토리</header>
        <main>
          <div className="brickcontainer">
            {userItemsJSX}
          </div>
        </main>
      </div>
    );
  }
}

export default History;