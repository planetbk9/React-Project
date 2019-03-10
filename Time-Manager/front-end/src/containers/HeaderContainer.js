import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from 'components/Header';
import * as watchActions from 'store/modules/watch';
import * as dbActions from 'store/modules/db';
import * as commonActions from 'store/modules/common';
import funcs from 'utils/funcs';
import * as restAPI from 'utils/restAPI';

class HeaderContainer extends Component {
  handleModal = (modal, modalType) => {
    this.props.common_modal({modal, modalType});
  }

  loadUser = (user) => {
    const today = funcs.getDate();
    const { watch_sync, fetchDB } = this.props;
    
    fetchDB(user)
    .then(res => {
      return funcs.findUserItemByDate(res.userItems, today);
    })
    .then(userItem => {
      if(userItem) {
        watch_sync({date: today, dateItem: userItem.dateItems[userItem.dateItems.length-1]});
        return null;
      } else {
        return restAPI.addData(user, {date: today, dateItems: [{subject: '', time: 0}]});
      }
    })
    .then(user => {
      if(!user) throw new Error('Date already exist');
      return fetchDB(user);
    })
    .then(user => {
      if(!user || !user.userItems) return null;
        const userItem = funcs.findUserItemByDate(user.userItems, today);
      if(userItem) watch_sync({date: userItem.date, dateItem: userItem.dateItems[userItem.dateItems.length-1]});
    })
    .catch(err => {
      console.error(err);
    });
  }

  enrolUser = (id, password) => {
    return this.props.registerUser(id, password)
    .then(user => {
      console.log(user);
      this.loadUser(user);
      return user;
    });
  }

  loginUser = (id, password) => {
    return this.props.loginUser(id, password)
    .then(user => {
      if(!user) return;
      console.log(user + ' 로그인!');
      this.loadUser(user);
      return user;
    });
  }

  changePwd = (id, password) => {
    return this.props.changeUserInfo(id, password);
  }

  logout = () => {
    this.props.common_logout();
    this.props.db_clear();
    this.props.watch_sync();
  }
  changeScreen = (type) => {
    this.props.common_page(type);
  }

  componentDidMount() {
    if(this.props.state === 'login') {
      this.loadUser(this.props.user);
    }
  }

  render () {
    const { user, modal, modalType, state } = this.props;
    return (
      <Header modal={modal} modalType={modalType} handleModal={this.handleModal} onResister={this.enrolUser} onLogin={this.loginUser} onLogout={this.logout} onChangePwd={this.changePwd} onChangePage={this.changeScreen} user={user} state={state}/>
    );
  }
}

const mapStateToProps = ({common, db}) => {
  return {
    ...common,
    ...db
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({...commonActions, ...dbActions, ...watchActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);