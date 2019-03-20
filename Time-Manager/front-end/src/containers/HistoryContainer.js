import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import History from 'components/History';
import * as watchActions from 'store/modules/watch';
import * as dbActions from 'store/modules/db';
import * as restAPI from 'utils/restAPI';
import funcs from 'utils/funcs';

class HistoryContainer extends Component {
  loadItem = (date, _id) => {
    const { db, watch_sync } = this.props;
    const dateItem = funcs.findItemById(db.userItems, date, _id);
    watch_sync({ date, dateItem });
  }
  deleteItem = (_id) => {
    const { user } = this.props.db;

    restAPI.deleteItem(user, _id)
      .then(res => {
        const userItems = res.data.userItems;
        this.props.db_insert_all({ user, userItems });
        return userItems;
      })
      .then(userItems => {
        const userItem = userItems[userItems.length - 1];
        const dateItem = userItem.dateItems[userItem.dateItems.length - 1];
        this.props.watch_sync({ date: userItem.date, dateItem });
      })
      .catch(err => {
        console.error(err);
      });
  }
  getHistoryItems = () => {
    if (this.props.state === 'logout') {
      return (
        <div className="brick-item-common brick-item-2">
          <p className="example-message">예시</p>
          <div className="brick-wrapper">
            <h3 className="history-item-header">2019-01-01</h3>
            <div className="history-item-container">
              <div className="history-item-subject">프로젝트 코딩</div>
              <div className="history-item-time">{funcs.timeToString(1210000)}</div>
              <div className="history-item-delete"><i className="fas fa-times"></i></div>
            </div>
            <div className="history-item-container">
              <div className="history-item-subject">레이아웃 작업</div>
              <div className="history-item-time">{funcs.timeToString(22210000)}</div>
              <div className="history-item-delete"><i className="fas fa-times"></i></div>
            </div>
            <div className="history-item-container">
              <div className="history-item-subject">운동</div>
              <div className="history-item-time">{funcs.timeToString(10210000)}</div>
              <div className="history-item-delete"><i className="fas fa-times"></i></div>
            </div>
          </div>
        </div>
      );
    }
    const userItems = this.props.db.userItems;
    const { loadItem, deleteItem } = this;
    let userItemsJSX = [];

    userItems.forEach(userItem => {
      const userItemJSX = userItem.dateItems.map(dateItem => {
        if (dateItem === null) return false;
        return (
          <div key={dateItem._id} className="history-item-container" onClick={() => { loadItem(userItem.date, dateItem._id); }}>
            <div className="history-item-subject">{dateItem.subject}</div>
            <div className="history-item-time">{funcs.timeToString(dateItem.time)}</div>
            <div className="history-item-delete" onClick={() => { deleteItem(dateItem._id); }}><i className="fas fa-times"></i></div>
          </div>
        );
      });
      userItemsJSX = userItemsJSX.concat(
        <div key={userItem._id} className="brick-item-common brick-item-2">
          <div className="brick-wrapper">
            <h3 className="history-item-header">
              {userItem.date}
            </h3>
            {userItemJSX}
          </div>
        </div>
      );
    });

    return userItemsJSX;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.db !== nextProps.db || this.props.screen !== nextProps.screen;
  }

  render() {
    return (
      <History items={this.getHistoryItems()} state={this.props.state}/>
    );
  }
}

const mapStateToProps = ({ db, common }) => {
  return {
    db: db,
    screen: common.screen,
    state: common.state
  };
};
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...watchActions, ...dbActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);