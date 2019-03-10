import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import History from 'components/History';
import * as watchActions from 'store/modules/watch';
import * as historyActions from 'store/modules/history';
import * as dbActions from 'store/modules/db';
import * as restAPI from 'utils/restAPI';
import funcs from 'utils/funcs';

class HistoryContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.db !== nextProps.db || this.props.screen !== nextProps.screen;
  }

  handleClick = (date, _id) => {
    const { db, watch_sync } = this.props;

    const dateItem = funcs.findItemById(db.userItems, date, _id);
    watch_sync({date, dateItem});
  }

  handleDelete = (_id) => {
    const { user } = this.props.db;

    restAPI.deleteItem(user, _id)
    .then(res => {
      console.log(res);
      this.props.fetchDB(user)
      .then(res => {
        let dateItem, userItem;
        const userItems = res.userItems;
        if(userItems) {
          userItem = userItems[userItems.length-1];
          let dateItems = userItem.dateItems;
          if(dateItems) {
            dateItem = dateItems[dateItems.length-1];
          }
        }
        this.props.watch_sync({date: userItem.date, dateItem});
      })
      .catch(err => {
        console.error(err);
      });
    })
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    const { db } = this.props;
    const { handleClick, handleDelete } = this;
    return (
      <History
        userItems={db.userItems}
        deleteItem={handleDelete}
        loadItem={handleClick}/>
    );
  }
}

const mapStateToProps = ({db, common}) => {
  return {
    db: db,
    screen: common.screen
  };
};
const mapDispatchToProps = (dispatch) => bindActionCreators({...watchActions, ...historyActions, ...dbActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);