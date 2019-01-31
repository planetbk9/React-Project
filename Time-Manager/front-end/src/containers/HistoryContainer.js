import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import History from 'components/History';
import * as historyActions from 'store/modules/history';
import * as restAPI from 'utils/restAPI';

class HistoryContainer extends Component {
  componentDidMount() {
    const { insert } = this.props;

    restAPI.getAllData()
    .then(res => {
      console.log(res);
      res.data.forEach(item => {
        insert(item);
      });
    })
    .catch(err => {
      console.error(err);
    });
  }
  render() {
    const { items } = this.props;
    return (
      <History 
        items={items}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.history.items
  };
};
const mapDispatchToProps = (dispatch) => bindActionCreators(historyActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);